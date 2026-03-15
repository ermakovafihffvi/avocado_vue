import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#server/bd.js';

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
            defaultValue: 0
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

export default CurrentState;
