import { DataTypes, Model } from 'sequelize';
import { sequelize } from '#server/bd.js';

class Group extends Model {}

Group.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'group', // We need to choose the model name
        tableName: 'user_group',
        timestamps: false,
    },
);

export default Group;
