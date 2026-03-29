import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#server/bd.js';
import addUserGroupScope from "#server/models/scopes/user_group.js";
import validationRules from '#shared/validation/rules.js';

const { positiveNumberTest } = validationRules();

class RepeatableExpense extends Model {}

RepeatableExpense.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        is_every_month: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        times: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                handleValidation(value) {
                    if (!positiveNumberTest(value)) {
                        throw new Error('Sum validation error');
                    }
                }
            }
        },
    },
    {
        sequelize, // We need to pass the connection instance
        modelName: 'RepeatableExpense', // We need to choose the model name
        tableName: 'repeatable_expenses',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true,
        deletedAt: 'deleted_at'
    }
);

addUserGroupScope(RepeatableExpense);

export default RepeatableExpense;
