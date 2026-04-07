import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#server/bd.js';
import addUserGroupScope from "#server/models/scopes/user_group.js";

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // Model attributes are defined here
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        current_group_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'user_group',
                key: 'id'
            }
        },
        isAdmin: {
            type: DataTypes.VIRTUAL,
        },
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'user', // We need to choose the model name
        tableName: 'user',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true,
        deletedAt: 'deleted_at',
        defaultScope: {
            attributes: { exclude: ['password', 'remember_token'] },
        },
    },
);

addUserGroupScope(User);

export default User;
