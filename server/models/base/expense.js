import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#server/bd.js';
import addUserGroupScope from "#server/models/scopes/user_group.js";
import addBasePeriodScope from "#server/models/scopes/base_period.js";
import validationRules from '#shared/validation/rules.js';

const { anyStringTest, positiveNumberTest } = validationRules();

class Expense extends Model {}

Expense.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sum: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                handleValidation(value) {
                    if (!positiveNumberTest(value)) {
                        throw new Error('Sum validation error');
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
        modelName: 'expenses', // We need to choose the model name
        tableName: 'expenses',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    }
);

addUserGroupScope(Expense);
addBasePeriodScope(Expense);

export default Expense;
