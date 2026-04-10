import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#server/bd.js';
import addUserGroupScope from "#server/models/scopes/user_group.js";
import validationRules from '#shared/validation/rules.js';

const { numberTest } = validationRules();

class CurrentState extends Model {}

CurrentState.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sum: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                handleValidation(value) {
                    if (!numberTest(value)) {
                        throw new Error('Sum validation error');
                    }
                }
            }
        },
        pseudo_month: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize, // We need to pass the connection instance
        modelName: 'CurrentState', // We need to choose the model name
        tableName: 'current_states',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true,
        deletedAt: 'deleted_at'
    }
);

addUserGroupScope(CurrentState);

export default CurrentState;
