import { Router } from "express";

import Messages from  '../../dao/dbManagers/message.manager.js';

const manager = new Messages();

const router = Router();

//read

router.get('/', async (req, res) => {
    res.render('chat', {  messages: await  manager.getAll() });
});

router.post('/', async (req, res) => {

    const io = req.app.get('socketio');

    try {
        const { user, message } = req.body;

        if(!user || !message) {
            return res.status(400).send({ status: 'error', message: 'incomplete values' });
        }

        const result = await manager.save({
            user,
            message
        });

        io.emit('showChats', await  manager.getAll());

        res.status(201).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

export default router;