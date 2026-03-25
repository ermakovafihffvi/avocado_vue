import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#server/bd.js';
import addUserGroupScope from "#server/models/scopes/user_group.js";

class CategoryExpense extends Model {}

CategoryExpense.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        limit: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        str_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        special: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    },
    {
        sequelize, // We need to pass the connection instance
        modelName: 'category_exp', // We need to choose the model name
        tableName: 'category_exp',
        timestamps: false,
        paranoid: true,
        deletedAt: 'deleted_at',
    }
);

addUserGroupScope(CategoryExpense);

export default CategoryExpense;
