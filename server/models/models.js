import Group from "./base/group.js";
import User from "./base/user.js";

User.hasMany(Group, {
    foreignKey: {
        name: 'admin_id'
    }
});
Group.belongsTo(User, {
    foreignKey: 'admin_id'
});

export default {
    User,
    Group,
};
