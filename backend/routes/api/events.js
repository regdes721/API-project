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
    res.json({
        "message": "Successfully deleted"
    });

});

module.exports = router;
