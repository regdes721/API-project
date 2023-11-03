const express = require('express')
const router = express.Router();
const { Event, Venue, EventImage, Attendance, Group, User, Membership } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth, restoreUser } = require('../../utils/auth');
const { route } = require('./groups');

module.exports = router;
