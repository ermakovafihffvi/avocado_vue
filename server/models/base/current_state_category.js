import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#server/bd.js';
import addUserGroupScope from "#server/models/scopes/user_group.js";
import validationRules from '#shared/validation/rules.js';

const { anyStringTest, codeAnyCaseTest } = validationRules();

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
            unique: true,
            validate: {
                handleValidation(value) {
                    if (!codeAnyCaseTest(value)) {
                        throw new Error('Str_id validation error');
                    }
                }
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                handleValidation(value) {
                    if (!anyStringTest(value)) {
                        throw new Error('Title should be string');
                    }
                }
            }
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
            validate: {
                handleValidation(value) {
                    if (value && !anyStringTest(value)) {
                        throw new Error('Description validation error');
                    }
                }
            }
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
