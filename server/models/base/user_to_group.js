import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#server/bd.js';

class UserToGroup extends Model {}

UserToGroup.init(
    {},
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'user_to_group', // We need to choose the model name
        tableName: 'user_to_group',
        timestamps: false,
    },
);

export default UserToGroup;
