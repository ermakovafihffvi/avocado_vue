import Group from "#server/models/base/group.js";

export default function (model) {
    model.addScope('userGroup', function (currentGroupId) {
        return {
            include: [
                {
                    model: Group,
                    as: 'group',
                    where: {
                        id: currentGroupId
                    }
                }
            ]
        };
    })
};
