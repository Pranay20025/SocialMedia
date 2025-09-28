import User from "../Model/userModel.js";
import Post from "../Model/postModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { populate } from "dotenv";

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    console.log("New user created:", newUser);

    return res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    const populatePosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post && post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      following: user.following,
      followers: user.followers,
      posts: populatePosts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Logged in successfully",
        user,
      });
  } catch (error) {
    console.error("Error logging in user:", error); // Log the error
    res.status(500).json({ message: "Error logging in user" });
  }
};

const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging out" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Fetching profile for user ID: ${userId}`);
    const user = await User.findById(userId).populate({path:'posts', options:{sort:{createdt:-1}}, populate:{
      path: 'comments',
      options: { sort: { createdAt: -1 } },
      populate:{
        path: 'author',
      }
    }}).populate('bookmarks');
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in getProfile:", error);  // More detailed error logging
    res.status(500).json({ message: "Error getting user" });
  }
};


const editProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
    if (!suggestedUsers.length) {
      return res.json({
        message: "No Suggested Users",
      });
    }
    return res.status(200).json({ success: true, users: suggestedUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting suggested users" });
  }
};

const followOrUnfollow = async (req, res) => {
  try {
    const followKarneWala = req.id; // mine id
    const jiskoFollowKarunga = req.params.id; // other person id
    if (followKarneWala === jiskoFollowKarunga) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
    const user = await User.findById(followKarneWala);
    const targetUser = await User.findById(jiskoFollowKarunga);

    if (!user || !targetUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const isFollowing = user.following.includes(jiskoFollowKarunga);
    if (isFollowing) {
      // unfollow
      await Promise.all([
        User.updateOne({ _id: followKarneWala }, { $pull: { following: jiskoFollowKarunga } }),
        User.updateOne({ _id: jiskoFollowKarunga }, { $pull: { followers: followKarneWala } }),
      ]);
      return res.status(200).json({ message: "Unfollowed Successfully" });
    } else {
      // follow
      await Promise.all([
        User.updateOne({ _id: followKarneWala }, { $push: { following: jiskoFollowKarunga } }),
        User.updateOne({ _id: jiskoFollowKarunga }, { $push: { followers: followKarneWala } }),
      ]);
      return res.status(200).json({ message: "Followed Successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error following/unfollowing user" });
  }
};

export {
  getSuggestedUsers,
  followOrUnfollow,
  logout,
  login,
  register,
  editProfile,
  getProfile,
};
