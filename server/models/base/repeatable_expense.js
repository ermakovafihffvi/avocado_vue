import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#server/bd.js';

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
            defaultValue: 1
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

export default RepeatableExpense;
