const express = require('express')
const router = express.Router();
const { GroupImage, Group, Membership } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth, restoreUser } = require('../../utils/auth');
const { route } = require('./groups');

router.delete('/:imageId', requireAuth, restoreUser, async (req, res) => {
    const imageId = req.params.imageId;
    let groupId;
    let groupImage = await GroupImage.findByPk(imageId);
    if (!groupImage) {
        const err = new Error("Group Image couldn't be found");
        res.status(404);
        // err.status = 404;
        return res.json({
            message: err.message
        });
        // next(err)
    }
    if (groupImage) groupId = groupImage.groupId;
    const groupOrganizer = await Group.findOne({
        where: {
            id: groupId,
            organizerId: req.user.id
        }
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
    if (!groupOrganizer && !groupCoHost) {
        const err = new Error("Forbidden");
        res.status(403);
        // err.status = 403;
        return res.json({
            message: err.message
        });
        // next(err);
    }
    await groupImage.destroy();
    return res.json({
        "message": "Successfully deleted"
      });
})

module.exports = router;
