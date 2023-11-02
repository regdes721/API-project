const express = require('express')
const router = express.Router();
const { Event, Venue, EventImage, Attendance, Group, User, Membership } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth, restoreUser } = require('../../utils/auth');
const { route } = require('./groups');

router.get('/', async (req, res) => {
    const events = await Event.findAll({
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            }
        ]
    });
    const eventsBody = {
        "Events": []
    }
    let eventsList = [];
    for (const event of events) {
        const eventData = event.toJSON();
        eventData.numAttending = await Attendance.count({
            where: {
                eventId: event.id,
                status: "attending"
            }
        })
        let eventImage = await EventImage.findOne({
            where: {
                eventId: event.id,
                preview: true
            }
        });
        if (eventImage) eventData.previewImage = eventImage.url;
        const startDate = new Date(eventData.startDate);
        const endDate = new Date(eventData.endDate);
        const formattedStartDate = startDate.toISOString().replace('T', ' ').slice(0, 19);
        const formattedEndDate = endDate.toISOString().replace('T', ' ').slice(0, 19);
        eventData.startDate = formattedStartDate;
        eventData.endDate = formattedEndDate;
        delete eventData.description;
        delete eventData.capacity;
        delete eventData.price;
        delete eventData.createdAt;
        delete eventData.updatedAt;
        eventsList.push(eventData);
    }
    eventsBody["Events"] = eventsList;
    return res.json(eventsBody);
});

router.get('/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId, {
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'private', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
            },
            {
                model: EventImage,
                attributes: ['id', 'url', 'preview']
            }
        ]
    });
    if (!event) {
        const err = new Error("Event couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    const eventData = event.toJSON();
    eventData.numAttending = await Attendance.count({
        where: {
            eventId: event.id,
            status: "attending"
        }
    });
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);
    const formattedStartDate = startDate.toISOString().replace('T', ' ').slice(0, 19);
    const formattedEndDate = endDate.toISOString().replace('T', ' ').slice(0, 19);
    eventData.startDate = formattedStartDate;
    eventData.endDate = formattedEndDate;
    delete eventData.createdAt;
    delete eventData.updatedAt;
    res.json(eventData);
});

router.post('/:eventId/images', requireAuth, restoreUser, async (req, res) => {
    const eventId = req.params.eventId;
    let groupId;
    let groupCoHost;
    let groupOrganizer;
    const event = await Event.findByPk(eventId);
    if (event)  groupId = event.groupId;
    if (groupId) {
        groupOrganizer = await Group.findOne({
            where: {
                id: groupId,
                organizerId: req.user.id
            },
        });
    }
    if (groupId) {
        groupCoHost = await Group.findOne({
            include: {
                model: Membership,
                where: {
                    userId: req.user.id,
                    status: "co-host"
                }
            },
            where: {
                id: groupId
            }
        });
    }
    const eventAttendee = await Attendance.findOne({
        where: {
            eventId,
            userId: req.user.id,
            status: "attending"
        }
    });
    if ((event && !groupOrganizer && !groupCoHost && !eventAttendee) || !event) {
        const err = new Error("Event couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    const { url, preview } = req.body;
    let eventImage = await event.createEventImage({ url, preview });
    eventImage = eventImage.toJSON();
    delete eventImage.eventId;
    delete eventImage.updatedAt;
    delete eventImage.createdAt;
    res.json(eventImage);
});

router.put('/:eventId', requireAuth, restoreUser, async (req, res) => {
    const eventId = req.params.eventId;
    let groupId;
    let groupCoHost;
    let groupOrganizer;
    let event = await Event.findByPk(eventId);
    if (event)  groupId = event.groupId;
    if (groupId) {
        groupOrganizer = await Group.findOne({
            where: {
                id: groupId,
                organizerId: req.user.id
            },
        });
    }
    if (groupId) {
        groupCoHost = await Group.findOne({
            include: {
                model: Membership,
                where: {
                    userId: req.user.id,
                    status: "co-host"
                }
            },
            where: {
                id: groupId
            }
        });
    }
    if ((event && !groupOrganizer && !groupCoHost) || !event) {
        const err = new Error("Event couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    let { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const priceRegex = /^\d{1,7}(\.\d{1,2})?$/;
    const currentDate = new Date();
    let parsedStartDate;
    let parsedEndDate;
    let formattedStartDate;
    let formattedEndDate;
    let venue;
    if (startDate) parsedStartDate = new Date(startDate);
    if (endDate) parsedEndDate = new Date(endDate);
    if (!startDate) parsedOGStartDate = new Date(event.startDate);
    if (!endDate) parsedOGEndDate = new Date(event.endDate);
    let errors = {};
    if (venueId) {
        venue = await Venue.findOne({
            where: {
                id: venueId,
                groupId
            }
        });
    }
    if (venueId && !venue) {
        const err = new Error("Venue couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    if ((venueId && !Number.isInteger(venueId)) || (venueId && typeof venueId !== 'number') || venueId === "") errors.venueId = "Venue does not exist";
    if ((name && name.length < 5) || name === "") errors.name = "Name must be at least 5 characters";
    if ((type && type !== "Online" && type !== "In person") || type === "") errors.type = "Type must be Online or In person";
    if ((capacity && !Number.isInteger(capacity)) || (capacity && typeof capacity !== 'number') || capacity === "") errors.capacity = "Capacity must be an integer";
    if ((price && !priceRegex.test(price)) || (price && typeof price !== 'number') || price === "") errors.price = "Price is invalid";
    if (description === "") errors.description = "Description is required";
    if ((parsedStartDate && parsedStartDate <= currentDate) || startDate === "") errors.startDate = "Start date must be in the future";
    if ((parsedEndDate && parsedEndDate <= parsedStartDate) || endDate === "") errors.endDate = "End date is less than start date";
    if (errors.venueId || errors.name || errors.type || errors.capacity || errors.price || errors.description || errors.startDate || errors.endDate) {
        const err = new Error("Bad Request");
        res.status(400);
        err.errors = errors;
        return res.json({
            message: err.message,
            errors
        });
        // next(err)
    }
    if (venueId) event.venueId = venueId;
    if (name) event.name = name;
    if (type) event.type = type;
    if (capacity) event.capacity = capacity;
    if (price) event.price = price;
    if (description) event.description = description;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;
    event.updatedAt = new Date();
    await event.save();
    event = event.toJSON();
    if (parsedStartDate) {
        formattedStartDate = parsedStartDate.toISOString().replace('T', ' ').slice(0, 19);
    }
    if (parsedEndDate) {
        formattedEndDate = parsedEndDate.toISOString().replace('T', ' ').slice(0, 19);

    }
    if (!parsedStartDate) {
        formattedStartDate = parsedOGStartDate.toISOString().replace('T', ' ').slice(0, 19);
    }
    if (!parsedEndDate) {
        formattedEndDate = parsedOGEndDate.toISOString().replace('T', ' ').slice(0, 19);
    }
    delete event.createdAt;
    delete event.updatedAt;
    const formattedResponse = {
        ...event
    }
    if (formattedStartDate) formattedResponse.startDate = formattedStartDate;
    if (formattedEndDate) formattedResponse.endDate = formattedEndDate;
    return res.json(formattedResponse);
});

router.delete('/:eventId', requireAuth, restoreUser, async (req, res) => {
    const eventId = req.params.eventId;
    let groupId;
    let groupCoHost;
    let groupOrganizer;
    const event = await Event.findByPk(eventId);
    if (event)  groupId = event.groupId;
    if (groupId) {
        groupOrganizer = await Group.findOne({
            where: {
                id: groupId,
                organizerId: req.user.id
            },
        });
    }
    if (groupId) {
        groupCoHost = await Group.findOne({
            include: {
                model: Membership,
                where: {
                    userId: req.user.id,
                    status: "co-host"
                }
            },
            where: {
                id: groupId
            }
        });
    }
    if ((event && !groupOrganizer && !groupCoHost) || !event) {
        const err = new Error("Event couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    await event.destroy();
    return res.json({
        "message": "Successfully deleted"
    });
});

module.exports = router;
