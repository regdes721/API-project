const express = require('express')
const router = express.Router();
const { Group, Membership, GroupImage } = require('../../db/models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
    const groups = await Group.findAll();
    const groupsBody = {
        "Groups": []
    }

    let groupsList = [];

    for (const group of groups) {
        const groupData = group.toJSON()
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
        })
        groupData.previewImage = groupImage.url
        groupsList.push(groupData);
    }

    groupsBody["Groups"] = groupsList;

    res.json(groupsBody);
});

module.exports = router;
