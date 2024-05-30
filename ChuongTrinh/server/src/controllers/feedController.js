import db from '../models';

export async function getFeed(req, res) {
    try {
        const data = await db.Feeds.findAll();
        res.status(200).json({
            status: 200,
            data,
        });
    } catch (e) {
        res.status(400).json({
            status: 400,
            message: e.message,
        });
    }
}
export async function addFeed(req, res) {
    try {
        await db.Feeds.create({
            name: req.body.name,
            embedCode: req.body.embedCode,
        });
        return res.status(200).json({ message: 'Thêm mới thành công' });
    } catch(e) {
        return res.status(201).json({ message: 'Thêm mới thất bại' });
    }
}
export async function deleteFeed(req, res) {
    const id = req.params.id;
    try {
        await db.Feeds.destroy({
            where: {
                id,
            },
        });
        return res.status(200).json({ message: 'Xóa feed thành công' });
    } catch {
        return res.status(201).json({ message: 'Feed này không thể xóa' });
    }
}
