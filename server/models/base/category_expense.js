import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#server/bd.js';
import addUserGroupScope from "#server/models/scopes/user_group.js";
import validationRules from '#shared/validation/rules.js';

const { anyStringTest, positiveNumberTest, codeAnyCaseTest } = validationRules();

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
            validate: {
                handleValidation(value) {
                    if (!anyStringTest(value)) {
                        throw new Error('Title should be string');
                    }
                }
            }
        },
        limit: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0,
            validate: {
                handleValidation(value) {
                    if (value && !positiveNumberTest(value)) {
                        throw new Error('Limit validation error');
                    }
                }
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
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
