const express = require('express')
const router = express.Router();
const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');
const { Op } = require('sequelize');

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
        })
        groupData.previewImage = groupImage.url
        groupsList.push(groupData);
    }

    groupsBody["Groups"] = groupsList;

    res.json(groupsBody);
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
        })

        res.json(groupData)
    }
    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        res.json({
            message: err.message
        })
        // next(err)
    }
});

module.exports = router;
