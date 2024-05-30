import db from '../models/index.js';

const Sequelize = require('sequelize');
const DashboardController = async (req, res) => {
    const totalOrder = await db.Order.count();
    const totalProduct = await db.Product.count();
    const totalUser = await db.User.count();
    const revenue = await db.Order.sum('total');
    const productHighest = await db.Product.findAll({
        order: [['buyTurn', 'DESC']],
        limit: 10
    });
    const productLowest = await db.Product.findAll({
        order: [['buyTurn', 'ASC']],
        limit: 10
    });


    return res.status(200).json({
        result: {
            totalOrder,
            totalProduct,
            totalUser,
            revenue,
            productHighest,
            productLowest
        },
    });
};
export default DashboardController;
