import express from "express"
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from "../Controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.get("/logout", logout);
userRoute.get("/:id/profile", isAuthenticated, getProfile);
userRoute.post("/profile/edit/:id", upload.single("profilePicture"), editProfile);
userRoute.get("/suggested", isAuthenticated, getSuggestedUsers);
userRoute.post("/followorunfollow/:id", isAuthenticated, followOrUnfollow);

export default userRoute;