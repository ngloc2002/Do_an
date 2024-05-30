import db from '../models/index.js';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

export const addUser = async (req, res) => {
    try {
        await db.User.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            role: 0,
        });
        return res.status(200).json({ message: 'Thêm mới thành công' });
    } catch {
        return res.status(201).json({ message: 'Thêm mới thất bại' });
    }
};
export const editUser = async (req, res) => {
    try {
        const email = req.params.email;

        const user = await db.User.findOne({ where: { email }});

        user.name = req.body.name;
        user.phone = req.body.phone;
        user.address = req.body.address;
        user.password = req.body.password;
        user.email = req.body.email;

        await user.save();

        return res.status(200).json({ message: 'Cập nhật thành công' });
    } catch {
        return res.status(201).json({ message: 'Cập nhật thất bại' });
    }
};

export const detailUser = async (req, res) => {
    // const idBrand = req.params.id;
    const email = req.query.email;
    const data = await db.User.findOne({ where: { email: email }, raw: true });
    return res.status(200).json({ user: data });
};
