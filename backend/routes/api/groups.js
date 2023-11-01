const express = require('express')
const router = express.Router();
const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth, restoreUser } = require('../../utils/auth');

router.get('/', async (req, res) => {
    const groups = await Group.findAll();
    const groupsBody = {
        "Groups": []
    }

    let groupsList = [];

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
        if (groupImage) groupData.previewImage = groupImage.url;

        const createdAt = new Date(groupData.createdAt);
        const updatedAt = new Date(groupData.updatedAt);
        const formattedCreatedAt = createdAt.toISOString().replace('T', ' ').slice(0, 19);
        const formattedUpdatedAt = updatedAt.toISOString().replace('T', ' ').slice(0, 19);
        groupData.createdAt = formattedCreatedAt;
        groupData.updatedAt = formattedUpdatedAt;

        groupsList.push(groupData);
    }

    groupsBody["Groups"] = groupsList;

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
    groupsBody["Groups"] = groupsList;

    return res.json(groupsBody);
});

router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    });
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

        const createdAt = new Date(groupData.createdAt);
        const updatedAt = new Date(groupData.updatedAt);
        const formattedCreatedAt = createdAt.toISOString().replace('T', ' ').slice(0, 19);
        const formattedUpdatedAt = updatedAt.toISOString().replace('T', ' ').slice(0, 19);
        const formattedResponse = {
            ...groupData,
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt
        }

        res.json(formattedResponse);
    }
    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
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
    const formattedResponse = {
        ...newGroup,
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt
    }
    res.status(201);
    return res.json(formattedResponse);
});

router.post('/:groupId/images', requireAuth, restoreUser, async (req, res) => {
    const user = req.user.toJSON();
    const groupId = req.params.groupId;
    const { url, preview } = req.body;
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    });
    if (group && url && preview && req.user.id === group.organizerId) {
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
    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
});

router.put('/:groupId', requireAuth, restoreUser, async (req, res) => {
    const organizerId = req.user.id;
    const groupId = req.params.groupId;
    let group = await Group.findOne({
        where: {
            id: groupId,
            organizerId
        }
    });
    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        res.json({
            message: err.message
        });
        // next(err)
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
    const formattedResponse = {
        ...group,
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt
    }
    return res.json(formattedResponse);
});

router.delete('/:groupId', requireAuth, restoreUser, async (req, res) => {
    const organizerId = req.user.id;
    const groupId = req.params.groupId;
    let group = await Group.findOne({
        where: {
            id: groupId,
            organizerId
        }
    });
    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    await group.destroy();
    res.json({
        "message": "Successfully deleted"
    })
});

router.get('/:groupId/venues', requireAuth, restoreUser, async (req, res) => {
    const organizerId = req.user.id;
    const id = req.params.groupId;
    const venuesBody = {
        "Venues": []
    }
    let venuesList = [];
    let group = await Group.findByPk(id, {
        where: {
            organizerId
        },
        include: Venue
    });
    res.json(group);
    // if (!group) {
    //     const err = new Error("Group couldn't be found");
    //     err.status = 404;
    //     return res.json({
    //         message: err.message
    //     });
    //     // next(err)
    // }
    // group = group.toJSON();
    // let venues = group.Venues;
    // console.log(venues);
    // for (const venue of venues) {
    //     delete venue.createdAt;
    //     delete venue.updatedAt;
    //     delete venue.Event;
    //     venuesList.push(venue);
    // }
    // venuesBody["Venues"] = venuesList;

    // res.json(venuesBody);
});

router.post('/:groupId/venues', requireAuth, restoreUser, async (req, res) => {
    const groupId = req.params.groupId;
    const groupOrganizer = await Group.findOne({
        where: {
            id: groupId,
            organizerId: req.user.id
        },
    });
    const groupCoHost = await Group.findOne({
        include: User,
        through: {
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
    if (!groupOrganizer && !groupCoHost) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (typeof lat !== 'number') errors.lat = "Latitude is not valid";
    if (typeof lng !== 'number') errors.lng = "Longitude is not valid";
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
    let group = groupOrganizer || groupCoHost;
    let venue = await group.createVenue({ address, city, state, lat, lng });
    venue = venue.toJSON();
    delete venue.createdAt;
    delete venue.updatedAt;
    res.json(venue);
});

module.exports = router;
