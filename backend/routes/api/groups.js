const express = require('express')
const router = express.Router();
const { Group, Membership, GroupImage, User, Venue, Event, Attendance, EventImage } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth, restoreUser } = require('../../utils/auth');

router.get('/', async (req, res) => {
    const groups = await Group.findAll();
    const groupsBody = {
        "Groups": []
    }

    let groupsList = [];
    if (groups) {
        for (const group of groups) {
            const groupData = group.toJSON();
            groupData.numMembers = await Membership.count({
                where: {
                    groupId: group.id,
                    status: {
                        [Op.not]: "pending"
                    }
                }
            });
            let groupImage = await GroupImage.findOne({
                where: {
                    groupId: group.id,
                    preview: true
                }
            });
            if (groupImage) groupData.previewImage = groupImage.url;

            const createdAt = new Date(groupData.createdAt);
            const updatedAt = new Date(groupData.updatedAt);
            const formattedCreatedAt = createdAt.toISOString().replace('T', ' ').slice(0, 19);
            const formattedUpdatedAt = updatedAt.toISOString().replace('T', ' ').slice(0, 19);
            groupData.createdAt = formattedCreatedAt;
            groupData.updatedAt = formattedUpdatedAt;

            groupsList.push(groupData);
        }
    }
    groupsBody["Groups"] = groupsList;
    if (!groupsBody["Groups"].length) groupsBody["Groups"] = null;
    return res.json(groupsBody);
});

router.get('/current', requireAuth, restoreUser, async (req, res) => {
    const groupsBody = {
        "Groups": []
    }
    let groupsList = [];
    const groups = await Group.findAll({
        include: User,
        through: {
            model: Membership,
            where: {
                userId: req.user.id
            }
        } ,
        where: {
            [Op.or]: {
                organizerId: req.user.id,
            }
        }
    });
    if (groups) {
        for (const group of groups) {
            const groupData = group.toJSON();
            groupData.numMembers = await Membership.count({
                where: {
                    groupId: group.id,
                    status: {
                        [Op.not]: "pending"
                    }
                }
            });
            groupImage = await GroupImage.findOne({
                where: {
                    groupId: group.id,
                    preview: true
                }
            });
            if (groupImage) groupData.previewImage = groupImage.url
            delete groupData.createdAt;
            delete groupData.updatedAt;
            delete groupData.User;
            groupsList.push(groupData);
        }
    }
    groupsBody["Groups"] = groupsList;
    if (!groupsBody["Groups"].length) groupsBody["Groups"] = null;
    return res.json(groupsBody);
});

router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    });
    if (!group) {
        const err = new Error("Group couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    if (group) {
        const groupData = group.toJSON();
        groupData.numMembers = await Membership.count({
            where: {
                groupId: group.id,
                status: {
                    [Op.not]: "pending"
                }
            }
        });
        groupData.GroupImages = await GroupImage.findAll({
            where: {
                groupId: group.id
            },
            attributes: ['id', 'url', 'preview']
        });
        groupData.Organizer = await User.findOne({
            where: {
                id: group.organizerId
            },
            attributes: ['id', 'firstName', 'lastName']
        });
        groupData.Venues = await Venue.findAll({
            where: {
                groupId: group.id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        // console.log(typeof groupData.Venues[1].lat)
        if (!groupData.Venues.length) groupData.Venues = null;
        let venues = groupData.Venues;
        if (venues) {
            for (const venue of venues) {
                venue.lat = parseFloat(venue.lat);
                venue.lng = parseFloat(venue.lng);
            }
        }
        const createdAt = new Date(groupData.createdAt);
        const updatedAt = new Date(groupData.updatedAt);
        const formattedCreatedAt = createdAt.toISOString().replace('T', ' ').slice(0, 19);
        const formattedUpdatedAt = updatedAt.toISOString().replace('T', ' ').slice(0, 19);
        groupData.createdAt = formattedCreatedAt;
        groupData.updatedAt = formattedUpdatedAt;
        // const formattedResponse = {
        //     ...groupData,
        //     createdAt: formattedCreatedAt,
        //     updatedAt: formattedUpdatedAt
        // }
        res.json(groupData);
    }
});

router.post('/', requireAuth, restoreUser, async (req, res, next) => {
    const organizerId = req.user.id;
    const { name, about, type, private, city, state } = req.body;
    let errors = {};
    if (name.length >  60) {
        errors.name = "Name must be 60 characters or less";
    }
    if (about.length < 50) {
        errors.about = "About must be 50 characters or more";
    }
    if (type !== 'Online' && type !== 'In person') {
        errors.type = "Type must be 'Online' or 'In person'";
    }
    if (private !== true && private !== false) {
        errors.private = "Private must be a boolean";
    }
    if (!city) {
        errors.city = "City is required";
    }
    if (!state) {
        errors.state = "State is required";
    }
    if (errors.name || errors.about || errors.type || errors.private || errors.city || errors.state) {
        const err = new Error("Bad Request");
        res.status(400);
        err.errors = errors
        return res.json({
            message: err.message,
            errors
        });
        // next(err)
    }
    let newGroup = await Group.create({
        organizerId,
        name,
        about,
        type,
        private,
        city,
        state
    });
    newGroup = newGroup.toJSON();
    const createdAt = new Date(newGroup.createdAt);
    const updatedAt = new Date(newGroup.updatedAt);
    const formattedCreatedAt = createdAt.toISOString().replace('T', ' ').slice(0, 19);
    const formattedUpdatedAt = updatedAt.toISOString().replace('T', ' ').slice(0, 19);
    newGroup.createdAt = formattedCreatedAt;
    newGroup.updatedAt = formattedUpdatedAt;
    // const formattedResponse = {
    //     ...newGroup,
    //     createdAt: formattedCreatedAt,
    //     updatedAt: formattedUpdatedAt
    // }
    res.status(201);
    return res.json(newGroup);
});

router.post('/:groupId/images', requireAuth, restoreUser, async (req, res) => {
    const user = req.user.toJSON();
    const groupId = req.params.groupId;
    const { url, preview } = req.body;
    const group = await Group.findByPk(groupId);
    if (!group) {
        const err = new Error("Group couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    const groupOrganizer = await Group.findOne({
        where: {
            id: groupId,
            organizerId: req.user.id
        },
    });
    if (!groupOrganizer) {
        const err = new Error("Forbidden");
        res.status(403);
        // err.status = 403;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    if (group && url && (preview === true || preview === false) && req.user.id === group.organizerId) {
        const newGroupImage = await GroupImage.create({
            groupId,
            url,
            preview
        });
        let newGroupImageResult = newGroupImage.toJSON();
        delete newGroupImageResult.groupId;
        delete newGroupImageResult.updatedAt;
        delete newGroupImageResult.createdAt;
        return res.json(newGroupImageResult);
    }
});

router.put('/:groupId', requireAuth, restoreUser, async (req, res) => {
    const groupId = req.params.groupId;
    let group = await Group.findByPk(groupId);
    if (!group) {
        const err = new Error("Group couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    const groupOrganizer = await Group.findOne({
        where: {
            id: groupId,
            organizerId: req.user.id
        },
    });
    if (!groupOrganizer) {
        const err = new Error("Forbidden");
        res.status(403);
        // err.status = 403;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    const { name, about, type, private, city, state } = req.body;
    let errors = {};
    if (name && name.length >  60) {
        errors.name = "Name must be 60 characters or less";
    }
    if (about && about.length < 50) {
        errors.about = "About must be 50 characters or more";
    }
    if (type && type !== 'Online' && type !== 'In person') {
        errors.type = "Type must be 'Online' or 'In person'";
    }
    if (private && private !== true && private !== false) {
        errors.private = "Private must be a boolean";
    }
    if (city === "") {
        errors.city = "City is required";
    }
    if (state === "") {
        errors.state = "State is required";
    }
    if (errors.name || errors.about || errors.type || errors.private || errors.city || errors.state) {
        const err = new Error("Bad Request");
        res.status(400);
        err.errors = errors
        return res.json({
            message: err.message,
            errors
        });
        // next(err)
    }
    if (name) group.name = name;
    if (about) group.about = about;
    if (type) group.type = type;
    if (private) group.private = private;
    if (city) group.city = city;
    if (state) group.state = state;
    group.updatedAt = new Date();
    await group.save();
    group = group.toJSON();
    const createdAt = new Date(group.createdAt);
    const updatedAt = new Date(group.updatedAt);
    const formattedCreatedAt = createdAt.toISOString().replace('T', ' ').slice(0, 19);
    const formattedUpdatedAt = updatedAt.toISOString().replace('T', ' ').slice(0, 19);
    group.createdAt = formattedCreatedAt;
    group.updatedAt = formattedUpdatedAt;
    // const formattedResponse = {
    //     ...group,
    //     createdAt: formattedCreatedAt,
    //     updatedAt: formattedUpdatedAt
    // }
    return res.json(group);
});

router.delete('/:groupId', requireAuth, restoreUser, async (req, res) => {
    const groupId = req.params.groupId;
    let group = await Group.findByPk(groupId);
    if (!group) {
        const err = new Error("Group couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    if (group.organizerId !== req.user.id) {
        const err = new Error("Forbidden");
        res.status(403);
        // err.status = 403;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    await group.destroy();
    return res.json({
        "message": "Successfully deleted"
    });
});

router.get('/:groupId/venues', requireAuth, restoreUser, async (req, res) => {
    const groupId = req.params.groupId;
    let group = await Group.findByPk(groupId, {
        include: 'venues'
    });
    const groupOrganizer = await Group.findOne({
        where: {
            id: groupId,
            organizerId: req.user.id
        },
    });
    const groupCoHost = await Group.findOne({
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
    if (!group) {
        const err = new Error("Group couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    if (!groupOrganizer && !groupCoHost) {
        const err = new Error("Forbidden");
        res.status(403);
        // err.status = 403;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    const venuesBody = {
        "Venues": []
    }
    let venuesList = [];
    group = group.toJSON();
    let venues = group.venues;
    // console.log(venues);
    if (venues) {
        for (const venue of venues) {
            // console.log(typeof venue.lng)
            venue.lat = parseFloat(venue.lat);
            venue.lng = parseFloat(venue.lng);
            delete venue.createdAt;
            delete venue.updatedAt;
            delete venue.Event;
            venuesList.push(venue);
        }
    }
    venuesBody["Venues"] = venuesList;
    res.json(venuesBody);
});

router.post('/:groupId/venues', requireAuth, restoreUser, async (req, res) => {
    const groupId = req.params.groupId;
    let group = await Group.findByPk(groupId);
    const groupOrganizer = await Group.findOne({
        where: {
            id: groupId,
            organizerId: req.user.id
        },
    });
    const groupCoHost = await Group.findOne({
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
    const { address, city, state, lat, lng } = req.body;
    let errors = {};
    if (!group) {
        const err = new Error("Group couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    if (!groupOrganizer && !groupCoHost) {
        const err = new Error("Forbidden");
        res.status(403);
        // err.status = 403;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (typeof lat !== 'number' || lat < -90 || lat > 90) errors.lat = "Latitude is not valid";
    if (typeof lng !== 'number' || lng < -180 || lng > 180) errors.lng = "Longitude is not valid";
    if (errors.address || errors.city || errors.state || errors.lat || errors.lng) {
        const err = new Error("Bad Request");
        res.status(400);
        err.errors = errors;
        return res.json({
            message: err.message,
            errors
        });
        // next(err)
    }
    group = groupOrganizer || groupCoHost;
    let venue = await group.createVenue({ address, city, state, lat, lng });
    venue = venue.toJSON();
    venue.lat = parseFloat(venue.lat);
    venue.lng = parseFloat(venue.lng);
    delete venue.createdAt;
    delete venue.updatedAt;
    // console.log(typeof venue.lng)
    res.json(venue);
});

router.get('/:groupId/events', async (req, res) => {
    const groupId = req.params.groupId;
    let group = await Group.findByPk(groupId);
    if (!group) {
        const err = new Error("Group couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    const events = await Event.findAll({
        where: {
            groupId
        },
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
    if (events) {
        for (const event of events) {
            const eventData = event.toJSON();
            eventData.numAttending = await Attendance.count({
                where: {
                    eventId: event.id,
                    status: "attending"
                }
            });
            let eventImage = await EventImage.findOne({
                where: {
                    eventId: event.id,
                    preview: true
                }
            });
            if (eventImage) eventData.previewImage = eventImage.url;
            // const startDate = new Date(eventData.startDate);
            // const endDate = new Date(eventData.endDate);
            // const formattedStartDate = startDate.toISOString().replace('T', ' ').slice(0, 19);
            // const formattedEndDate = endDate.toISOString().replace('T', ' ').slice(0, 19);
            // eventData.startDate = formattedStartDate;
            // eventData.endDate = formattedEndDate;
            delete eventData.description;
            delete eventData.capacity;
            delete eventData.price;
            delete eventData.createdAt;
            delete eventData.updatedAt;
            eventsList.push(eventData);
        }
    }
    eventsBody["Events"] = eventsList;
    if (!eventsBody["Events"].length) eventsBody["Events"] = null;
    return res.json(eventsBody);
});

router.post('/:groupId/events', requireAuth, restoreUser, async (req, res) => {
    const groupId = req.params.groupId;
    let group = await Group.findByPk(groupId);
    const groupOrganizer = await Group.findOne({
        where: {
            id: groupId,
            organizerId: req.user.id
        },
    });
    const groupCoHost = await Group.findOne({
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
    if (!group) {
        const err = new Error("Group couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    if (!groupOrganizer && !groupCoHost) {
        const err = new Error("Forbidden");
        res.status(403);
        // err.status = 403;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    let { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const priceRegex = /^\d{1,7}(\.\d{1,2})?$/;
    const currentDate = new Date();
    let parsedStartDate;
    let parsedEndDate;
    let venue;
    if (startDate) parsedStartDate = new Date(startDate);
    if (endDate) parsedEndDate = new Date(endDate);
    let errors = {};
    if (venueId) {
        venue = await Venue.findOne({
            where: {
                id: venueId,
                groupId
            }
        });
    }
    if ((venueId && !venue)) errors.venueId = "Venue does not exist";
    if ((name && name.length < 5) || !name) errors.name = "Name must be at least 5 characters";
    if (type !== "Online" && type !== "In person") errors.type = "Type must be Online or In person";
    if (!Number.isInteger(capacity) || typeof capacity !== 'number' || !capacity) errors.capacity = "Capacity must be an integer";
    if (!priceRegex.test(price) || typeof price !== 'number' || !price) errors.price = "Price is invalid";
    if (!description) errors.description = "Description is required";
    if ((parsedStartDate && parsedStartDate <= currentDate) || !parsedStartDate) errors.startDate = "Start date must be in the future";
    if ((parsedEndDate && parsedEndDate <= parsedStartDate) || !parsedEndDate) errors.endDate = "End date is less than start date";
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
    if (!venueId) venueId = null;
    group = groupOrganizer || groupCoHost;
    let event = await group.createEvent({ venueId, name, type, capacity, price, description, startDate, endDate });
    event = event.toJSON();
    event.price = parseFloat(event.price);
    const formattedStartDate = parsedStartDate.toISOString().replace('T', ' ').slice(0, 19);
    const formattedEndDate = parsedEndDate.toISOString().replace('T', ' ').slice(0, 19);
    event.startDate = formattedStartDate;
    event.endDate = formattedEndDate;
    delete event.createdAt;
    delete event.updatedAt;
    // const formattedResponse = {
    //     ...event,
    //     startDate: formattedStartDate,
    //     endDate: formattedEndDate
    // }
    res.json(event);
});

router.get('/:groupId/members', async (req, res) => {
    const groupId = req.params.groupId;
    let group = await Group.findByPk(groupId);
    if (!group) {
        const err = new Error("Group couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    const groupOrganizer = await Group.findOne({
        where: {
            id: groupId,
            organizerId: req.user.id
        },
    });
    const groupCoHost = await Group.findOne({
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
    let members = await User.findAll({
        include: {
            model: Membership,
            attributes: ["status"],
            where: {
                groupId
            }
        },
        attributes: ["id", "firstName", "lastName"]
    });
    const membersBody = {
        "Members": []
    }
    let membersList = [];
    if (members) {
        for (const member of members) {
            const memberData = member.toJSON();
            memberData.Membership = {};
            if (member.Memberships[0].status !== 'pending') {
                memberData.Membership.status = member.Memberships[0].status;
                delete memberData.Memberships;
                membersList.push(memberData)
            }
        }
    }
    if (groupOrganizer || groupCoHost) {
        if (members) {
            for (const member of members) {
                const memberData = member.toJSON();
                memberData.Membership = {};
                if (member.Memberships[0].status === 'pending') {
                    memberData.Membership.status = member.Memberships[0].status;
                delete memberData.Memberships;
                membersList.push(memberData)
                }
            }
        }
    }
    membersBody["Members"] = membersList;
    if (!membersBody["Members"].length) membersBody["Members"] = null;
    return res.json(membersBody);
});

router.post('/:groupId/membership', requireAuth, restoreUser, async (req, res) => {
    const groupId = req.params.groupId;
    let group = await Group.findByPk(groupId);
    if (!group) {
        const err = new Error("Group couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    const member = await Membership.findOne({
        where: {
            groupId,
            userId: req.user.id
        }
    });
    if ((member && member.status === 'member') || (member && member.status === 'co-host')) {
        const err = new Error("User is already a member of the group");
        res.status(400);
        // err.status = 400;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    if (member && member.status === 'pending') {
        const err = new Error("Membership has already been requested");
        res.status(400);
        // err.status = 400;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    let newMember;
    if (!member) {
        const userId = req.user.id;
        const status = "pending";
        newMember = await group.createMembership({ userId, status });
        newMember = newMember.toJSON();
        newMember.memberId = newMember.userId;
        delete newMember.id;
        delete newMember.userId;
        delete newMember.groupId;
        delete newMember.createdAt;
        delete newMember.updatedAt;
    }
    return res.json(newMember);
});

router.put('/:groupId/membership', requireAuth, restoreUser, async (req, res) => {
    const groupId = req.params.groupId;
    let group = await Group.findByPk(groupId);
    if (!group) {
        const err = new Error("Group couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    const { memberId, status } = req.body;
    let user;
    let member;
    if (memberId) {
        user = await User.findByPk(memberId);
        member = await Membership.findOne({
            where: {
                groupId,
                userId: memberId
            }
        });
    };
    if (!user) {
        const err = new Error("Validation Error");
        res.status(400);
        // err.status = 400;
        return res.json({
            message: err.message,
            errors: {
                "memberId": "User couldn't be found"
              }
        });
        // next(err);
    }
    if (!member) {
        const err = new Error("Membership between the user and the group does not exist");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    if (status === 'pending') {
        const err = new Error("Validation Error");
        res.status(400);
        // err.status = 400;
        return res.json({
            message: err.message,
            errors: {
                "status" : "Cannot change a membership status to pending"
              }
        });
        // next(err);
    }
    const groupCoHost = await Group.findOne({
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
    if (status !== 'co-host' && status !== 'member' && status !== 'pending') {
        const err = new Error("Validation Error");
        res.status(400);
        // err.status = 400;
        return res.json({
            message: err.message,
            errors: {
                "status" : "Allowed status values: co-host, member, pending"
              }
        });
        // next(err);
    }
    if (group.organizerId !== req.user.id && !group.coHost && status === 'member') {
        const err = new Error("Forbidden");
        res.status(403);
        // err.status = 403;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    if (group.organizerId !== req.user.id && status === 'co-host') {
        const err = new Error("Forbidden");
        res.status(403);
        // err.status = 403;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    if ((group.organizerId === req.user.id || group.coHost) && status === 'member' && member.status === 'pending') {
        member.status = 'member';
        member.updatedAt = new Date();
        await member.save();
        member = member.toJSON();
        member.memberId = member.userId;
        delete member.userId;
        delete member.createdAt;
        delete member.updatedAt;
        return res.json(member);
    }
    if (group.organizerId && status === 'co-host' && (member.status === 'member' || member.status === 'pending')) {
        member.status = 'co-host';
        member.updatedAt = new Date();
        await member.save();
        member = member.toJSON();
        member.memberId = member.userId;
        delete member.userId;
        delete member.createdAt;
        delete member.updatedAt;
        return res.json(member);
    }
    else {
        const err = new Error("Forbidden");
        res.status(403);
        // err.status = 403;
        return res.json({
            message: err.message
        });
        // next(err);
    }
});

router.delete('/:groupId/membership', requireAuth, restoreUser, async (req, res) => {
    const groupId = req.params.groupId;
    let group = await Group.findByPk(groupId);
    if (!group) {
        const err = new Error("Group couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    const { memberId } = req.body;
    let user;
    let member;
    if (memberId) {
        user = await User.findByPk(memberId);
        member = await Membership.findOne({
            where: {
                groupId,
                userId: memberId
            }
        });
    };
    if (!user) {
        const err = new Error("Validation Error");
        res.status(400);
        // err.status = 400;
        return res.json({
            message: err.message,
            errors: {
                "memberId": "User couldn't be found"
              }
        });
        // next(err);
    }
    if (!member) {
        const err = new Error("Membership between the user and the group does not exist");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    if (group.organizerId !== req.user.id && member.userId !== req.user.id) {
        const err = new Error("Forbidden");
        res.status(403);
        // err.status = 403;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    if ((group.organizerId === req.user.id || member.userId === req.user.id) && memberId) {
        await member.destroy();
        return res.json({
            "message": "Successfully deleted membership from group"
        });
    }
});

module.exports = router;
