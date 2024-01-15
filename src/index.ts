import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import { ErrorMiddleware } from './middlewares/error.js';
import router from './routes/index.js';
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend domain
};


const server = createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});


app.use(cors(corsOptions));

//connect db
connectDB();

// main route
app.get("/", (req, res) => {
    res.send("running.....")
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('send-message', ({ message, room, userId, image, userName }) => {
        console.log("Message", message, "Room", room, "user", userId);

        io.to(room).emit('receive-message', { message, userId, image, userName });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

//other routes
app.use("/api/v1", router)

//error handling middleware
app.use(ErrorMiddleware);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is running on the port : ${PORT}`);
})