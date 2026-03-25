import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#server/bd.js';
import addUserGroupScope from "#server/models/scopes/user_group.js";

class CurrentStateCategory extends Model {}

CurrentStateCategory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        str_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
    },
    {
        sequelize, // We need to pass the connection instance
        modelName: 'current_state_categories', // We need to choose the model name
        tableName: 'current_state_categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true,
        deletedAt: 'deleted_at'
    }
);

addUserGroupScope(CurrentStateCategory);

export default CurrentStateCategory;
