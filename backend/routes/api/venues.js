const express = require('express')
const router = express.Router();
const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth, restoreUser } = require('../../utils/auth');

router.put('/:venueId', requireAuth, restoreUser, async (req, res) => {
    const venueId = req.params.venueId;
    let venue = Venue.findByPk(venueId);
    const venueOrganizer = await Venue.findOne({
        include: {
            model: Group,
            where: {
                organizerId: req.user.id
            }
        },
        where: {
            id: venueId
        }
    });
    const venueCheck = await Venue.findOne({
        include: {
            model: Group
        },
        where: {
            id: venueId
        }
    });
    const userCoHost = await Membership.findAll({
        where: {
            userId: req.user.id,
            // groupId: venueCheck.Group.id,
            status: "co-host"
        }
    });

    let venueCoHost;
    for (const membership of userCoHost) {
        if (venueCheck && membership.groupId === venueCheck.Group.id && membership.status === 'co-host') venueCoHost = membership;
    }
    const { address, city, state, lat, lng } = req.body;
    let errors = {};
    if (!venue) {
        const err = new Error("Venue couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    if (!venueOrganizer && !venueCoHost) {
        const err = new Error("Forbidden");
        res.status(403);
        // err.status = 403;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    if (address === "") errors.address = "Street address is required";
    if (city === "") errors.city = "City is required";
    if (state === "") errors.state = "State is required";
    if (lat && typeof lat !== 'number' || lat < -90 || lat > 90) errors.lat = "Latitude is not valid";
    if (lng && typeof lng !== 'number' || lng < -180 || lng > 180) errors.lng = "Longitude is not valid";
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
    venue = venueOrganizer || venueCheck;
    if (address) venue.address = address;
    if (city) venue.city = city;
    if (state) venue.state = state;
    if (lat) venue.lat = lat;
    if (lng) venue.lng = lng;
    await venue.save();
    venue = venue.toJSON();
    delete venue.createdAt;
    delete venue.updatedAt;
    delete venue.Group;
    res.json(venue)
})

module.exports = router;
