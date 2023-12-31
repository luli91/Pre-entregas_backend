import { Router } from "express";
import messageDao from "../daos/dbManager/message.dao.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const messages = await messageDao.findMessages();

    res.json({
        data: messages,
        message: "messages list",
        });
    } catch (error) {
    console.log(error);
    res.json({
        error,
        message: "Error",
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const message = await messageDao.findById(id);

        if (!message) return res.json({ message: "User not found" });

        res.json({
            message,
            message: "message found",
    });
    } catch (error) {
    console.log(error);
    res.json({
        error,
        message: "Error",
        });
    }
});

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const message = await messageDao.createMessage(req.body);

    res.json({
        message,
        message: "User created",
    });
    } catch (error) {
    console.log(error);
    res.json({
        error,
        message: "Error",
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await messageDao.updateMessage(id, req.body);

        const message = await messageDao.findById(id);

    res.json({
        message,
        message: "message updated",
        });
    } catch (error) {
    console.log(error);
    res.json({
        error,
        message: "Error",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await messageDao.deleteMessage(id);

    res.json({
        message,
        message: "message deleted",
    });
    } catch (error) {
    console.log(error);
    res.json({
        error,
        message: "Error",
        });
    }
});

export default router;