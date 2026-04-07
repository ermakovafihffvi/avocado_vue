import models from "#server/models/index.js";

export const isAdminCheck = async (req, res, next) => {
    const { Group } = models;
    const currentGroup = await Group.findByPk(req.user.current_group_id);
    if (req.user.id == currentGroup.id) {
        next();
    } else {
        res.status(407).send({message: "Admin permission id required"});
    }
};
