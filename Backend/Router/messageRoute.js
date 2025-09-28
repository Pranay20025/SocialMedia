import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getMessage, sendMessage } from "../Controllers/messageController.js";

const messageRoute = express.Router();

messageRoute.post("/send/:id", isAuthenticated, sendMessage);
messageRoute.get("/all/:id", isAuthenticated, getMessage);

export default messageRoute;