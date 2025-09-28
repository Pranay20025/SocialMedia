import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost, bookMarkPost, deletePost, dislikePost, getAllPosts, getCommentsOfPost, getUserPosts, likePost } from "../Controllers/postController.js";

const postRoute = express.Router();

postRoute.post("/addPost", isAuthenticated, upload.single("image"), addNewPost);
postRoute.get("/all", isAuthenticated, getAllPosts);
postRoute.get("/userpost/all", isAuthenticated, getUserPosts);
postRoute.get("/:id/like", isAuthenticated, likePost);
postRoute.get("/:id/dislike", isAuthenticated, dislikePost);
postRoute.post("/:id/comment", isAuthenticated, addComment);
postRoute.get("/:id/comment/all", isAuthenticated, getCommentsOfPost);
postRoute.delete("/delete/:id", isAuthenticated, deletePost);
postRoute.post("/:id/bookmark", isAuthenticated, bookMarkPost);


export default postRoute;