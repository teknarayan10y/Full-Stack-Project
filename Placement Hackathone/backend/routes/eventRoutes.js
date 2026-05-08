const express = require("express");
const router = express.Router();
const Event = require("../models/Event");


// Create Event
router.post("/", async (req, res) => {
    try {
        const { title, slug } = req.body;
        if (!title || !slug) {
            return res.status(400).json({ error: "Title and Slug are required fields." });
        }

        const event = new Event(req.body);
        await event.save();
        res.json(event);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
            return res.status(400).json({ error: "An event with this slug already exists." });
        }
        res.status(400).json({ error: err.message });
    }
});


// Get Event by Slug
router.get("/slug/:slug", async (req, res) => {
    const event = await Event.findOne({ slug: req.params.slug });

    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
});


// Increase Join Count
router.post("/join/:slug", async (req, res) => {
    const event = await Event.findOne({ slug: req.params.slug });

    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    event.joinCount += 1;
    await event.save();

    res.json({ message: "Join recorded" });
});

module.exports = router;