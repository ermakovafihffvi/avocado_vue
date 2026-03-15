import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#server/bd.js';
import addUserGroupScope from "#server/models/scopes/user_group.js";
import validationRules from '#shared/validation/rules.js';


const { stringTest, capitalLetterTest, numberTest } = validationRules();

class Currency extends Model {}

Currency.init(
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
                    if (!stringTest(value)) {
                        throw new Error('Title should be string');
                    }
                }
            }
        },
        str_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                handleValidation(value) {
                    if (!capitalLetterTest(value)) {
                        throw new Error('String code can contain only capital letters');
                    }
                }
            }
        },
        rate: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 1,
            validate: {
                handleValidation(value) {
                    if (!numberTest(value)) {
                        throw new Error('Rate should be a number');
                    }
                }
            },
        },
    },
    {
        sequelize, // We need to pass the connection instance
        modelName: 'Currency', // We need to choose the model name
        tableName: 'currency',
        timestamps: false,
    }
);

addUserGroupScope(Currency);

export default Currency;
