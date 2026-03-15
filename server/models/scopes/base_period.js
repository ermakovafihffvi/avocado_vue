import { Op } from 'sequelize';

export default function (model) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const baseMonth = now.getDate() <= 22 ? month : month + 1;

    const arr = {
        start_date: new Date(year, baseMonth - 1, 23, 0, 0, 0),
        end_date: new Date(year, baseMonth, 23, 0, 0, 0),
    };

    model.addScope('basePeriod', function () {
        return {
            where: {
                created_at: {
                    [Op.between]: [arr.start_date, arr.end_date]
                }
            }
        };
    })
};
