const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require("multer");
const path = require('path');
const LostItem = require('./models/LostItem');


const nodemailer = require('nodemailer');
require('dotenv').config(); // To use environment variables from .env file

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/hostel-feedback', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});


// Setup for storing images using multer
const storage = multer.diskStorage({
    destination: function (_, __, cb) {
      cb(null, 'uploads/');
    },
    filename: function (_, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });
  // MongoDB Schema for Lost Item
  app.post('/submit-lost-item', upload.single('image'), async (req, res) => {
    try {
      const { item, description, location } = req.body;
      const imagePath = req.file ? `uploads/${req.file.filename}` : null;
  
      const newItem = new LostItem({
        item,
        description,
        location,
        image: imagePath,
        comments: []
      });
  
      await newItem.save();
      res.status(201).json(newItem);
    } catch (err) {
      console.error("Error saving lost item:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  
  // Get all found items
app.get('/found-items', async (req, res) => {
    try {
      const items = await LostItem.find().sort({ createdAt: -1 });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: "Error fetching items" });
    }
  });
  
  // Add comment to a lost item
  app.post('/add-comment/:id', async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
  
    try {
      const item = await LostItem.findById(id);
      if (!item) return res.status(404).json({ error: "Item not found" });
  
      item.comments.push(comment);
      await item.save();
      res.status(200).json({ message: "Comment added" });
    } catch (err) {
      console.error("Comment error:", err);
      res.status(500).json({ error: "Failed to add comment" });
    }
  });
  
  // DELETE route to delete an item by ID
// Example route in backend server.js
// server.js or routes.js

app.delete('/delete-item/:itemId', async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const deletedItem = await LostItem.findByIdAndDelete(itemId);
  
      if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  
  


// Nodemailer setup using environment variables from .env
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });
  
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Nodemailer connection error:', error);
    } else {
      console.log('✅ Nodemailer is ready to send emails');
    }
  });
  
  // Email sending function
  const sendEmailToChiefMentor = (formData) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.MENTOR_EMAIL,
      subject: 'Leave Request Submission',
      text: `
        A student has submitted a leave request. Here are the details:
  
        Name: ${formData.name}
        Roll Number: ${formData.rollNumber}
        Class / Year: ${formData.classYear}
        Room Number / Hostel Block: ${formData.roomNumber}
        Contact Number: ${formData.contact}
        Reason for Leave: ${formData.reason}
        Leave Start Date: ${formData.startDate}
        Leave End Date: ${formData.endDate}
        Approved By: ${formData.approvalBy}
      `
    };
  
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('❌ Error sending email:', err);
      } else {
        console.log('📧 Email sent:', info.response);
      }
    });
  };
  
  // Sample POST route to handle leave submission
  app.post('/api/submit-leave', (req, res) => {
    const formData = req.body;
    console.log('Received leave request:', formData);
  
    // Call the email sending function here
    sendEmailToChiefMentor(formData);
  
    res.status(200).json({ message: 'Leave request submitted successfully!' });
  });

// Schema for feedback
const feedbackSchema = new mongoose.Schema({
  day: String,
  meal: String,
  like: Number,
  dislike: Number,
  timestamp: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Email sending function for dislikes
const sendDislikeEmail = (meal, day) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.MENTOR_EMAIL,
    subject: `Dislike Alert - ${meal} on ${day}`,
    text: `
      A student has expressed dissatisfaction with the ${meal} served on ${day}.
      They have marked the ${meal} as disliked, and it is recommended to review the menu for this day.

      Consider making adjustments to improve the satisfaction of students.
      Repeated dislikes might indicate that this meal is not well-received.

      Meal: ${meal}
      Day: ${day}
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('❌ Error sending email:', err);
    } else {
      console.log('📧 Email sent:', info.response);
    }
  });
};

// API route: /api/send-feedback
app.post('/api/send-feedback', async (req, res) => {
  const { day, meal, like, dislike } = req.body;

  try {
    const existing = await Feedback.findOne({ day, meal });

    if (existing) {
      existing.like = like;
      existing.dislike = dislike;
      await existing.save();
    } else {
      const feedback = new Feedback({ day, meal, like, dislike });
      await feedback.save();
    }

    // Only send email if dislike = 1
    if (dislike === 1) {
      sendDislikeEmail(meal, day);
    }

    res.status(200).json({ message: 'Feedback processed successfully' });
  } catch (err) {
    console.error('❌ Error saving feedback:', err);
    res.status(500).json({ error: 'Failed to process feedback' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
