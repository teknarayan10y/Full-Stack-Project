# EventEase - Event Management Platform

A comprehensive event management platform for hackathons, workshops, and corporate events with features like team management, real-time leaderboards, and digital ticketing.

## Features

- 🎟️ Event Registration & Digital Ticketing
- 👥 Team Formation & Management
- 🏆 Real-time Leaderboards
- 📅 Event Dashboard
- 🔔 Real-time Notifications
- 📱 Responsive Design

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-time**: WebSockets
- **Authentication**: JWT
- **Additional Libraries**:
  - QR Code Generation
  - PDF Generation
  - Form Validation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas or local MongoDB instance

### Installation

1. Clone the repository
2. Install dependencies for both client and server
3. Set up environment variables
4. Start the development servers

```bash
# Clone the repository
git clone https://github.com/yourusername/EventEase.git
cd EventEase

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```

### Running the Application

```bash
# Start the server (from server directory)
npm run dev

# Start the client (from client directory)
npm start
```

## Project Structure

```
event-ease/
├── client/                 # Frontend React application
├── server/                 # Backend Express server
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
