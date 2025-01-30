
import bcrypt from "bcrypt";

import { User } from '../models/User.js';
import { SavedPost } from '../models/SavedPost.js';
import { Post } from '../models/Post.js';
import { Chat } from '../models/Chat.js';
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get users!' });
  }
};

export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to get user!' });
    }
  };
  
  export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;
  
    if (id !== tokenUserId) {
      return res.status(403).json({ message: 'Not Authorized!' });
    }
  
    try {
      let updatedData = { ...inputs };
  
      if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
      }
      if (avatar) {
        updatedData.avatar = avatar;
      }
  
      const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
      const { password: userPassword, ...rest } = updatedUser.toObject();
  
      res.status(200).json(rest);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update user!' });
    }
  };

  export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
  
    if (id !== tokenUserId) {
      return res.status(403).json({ message: 'Not Authorized!' });
    }
  
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'User deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete user!' });
    }
  };
  

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const existingSavedPost = await SavedPost.findOne({ userId: tokenUserId, postId });

    if (existingSavedPost) {
      await SavedPost.findByIdAndDelete(existingSavedPost._id);
      res.status(200).json({ message: 'Post removed from saved list' });
    } else {
      await SavedPost.create({ userId: tokenUserId, postId });
      res.status(200).json({ message: 'Post saved' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save post!' });
  }
};


export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const userPosts = await Post.find({ userId: tokenUserId });
    const savedPosts = await SavedPost.find({ userId: tokenUserId }).populate('postId');

    res.status(200).json({
      userPosts,
      savedPosts: savedPosts.map((item) => item.postId),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get profile posts!' });
  }
};



export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const unreadCount = await Chat.countDocuments({
      userIDs: tokenUserId,
      seenBy: { $ne: tokenUserId },
    });
    res.status(200).json(unreadCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get notification number!' });
  }
};