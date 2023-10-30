const express = require('express')
const router = express.Router();
const { Group } = require('../../db/models');

router.get('/', async (req, res) => {
    const groups = await Group.findAll()
});

module.exports = router;
