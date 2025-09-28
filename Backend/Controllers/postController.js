import Post from "../Model/postModel.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import User from "../Model/userModel.js";
import Comment from "../Model/commentModel.js";
import { getRecieverSocketId } from "../Socket/socket.js";

// Add a new post
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    
    if (!image) {
      return res.status(400).json({ message: "Image Required" });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: 'author', select: "-password" });

    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'userName profilePicture' })
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'author',
          select: 'userName profilePicture',
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

// Get posts by a specific user
export const getUserPosts = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'userName profilePicture' })
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'author',
          select: 'userName profilePicture',
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const likerId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    await post.updateOne({ $addToSet: { likes: likerId } });
    await post.save();

    const user = await User.findById(likerId).select('userName , profilePicture');
    const postOwnerId = post.author.toString();
    if(postOwnerId !== likerId){
      const notification = {
        type: "like",
        userId: likerId,
        userDetails: user,
        postId,
        message:"Your Post Was Liked"
      }
      const postOwnerSocketId = getRecieverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit('notification', notification);

    }

    return res.status(200).json({ message: "Post liked", success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

// Dislike a post
export const dislikePost = async (req, res) => {
  try {
    const likerId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    await post.updateOne({ $pull: { likes: likerId } });
    await post.save();

    const user = await User.findById(likerId).select('userName , profilePicture');
    const postOwnerId = post.author.toString();
    if(postOwnerId !== likerId){
      const notification = {
        type: "dislike",
        userId: likerId,
        userDetails: user,
        postId,
        message:"Your Post Was disliked"
      }
      const postOwnerSocketId = getRecieverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit('notification', notification);

    }

    return res.status(200).json({ message: "Post disliked", success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commenterId = req.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      text,
      author: commenterId,
      post: postId,
    });

    post.comments.push(comment._id);
    await post.save();

    await comment.populate({ path: 'author', select: 'userName profilePicture' });

    return res.status(201).json({
      message: "Comment added successfully",
      comment,
      success: true,
    });

  } catch (error) {
    console.log('Error adding comment:', error.message);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};



// Get comments of a post
export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId })
      .populate('author', 'userName profilePicture');

    return res.status(200).json({ success: true, comments });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== authorId) {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(authorId);
    user.posts = user.posts.filter(id => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({ message: "Post deleted successfully", success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

// Bookmark or unbookmark a post
export const bookMarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      return res.status(200).json({ message: "Post unbookmarked successfully", type: "unsaved", success: true });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      return res.status(200).json({ message: "Post bookmarked successfully", type: "saved", success: true });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};
