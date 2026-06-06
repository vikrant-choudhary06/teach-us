import Friendship from '../models/Friendship.js';
import User from '../models/User.js';

// Get user friends and pending requests
export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all friendships involving the current user
    const friendships = await Friendship.find({
      $or: [{ requester: userId }, { recipient: userId }]
    }).populate('requester recipient', 'name email picture uid role');

    const friends = [];
    const pendingIncoming = [];
    const pendingOutgoing = [];

    friendships.forEach((f) => {
      if (!f.requester || !f.recipient) return;
      
      const isRequester = f.requester._id.toString() === userId.toString();
      const friend = isRequester ? f.recipient : f.requester;

      if (f.status === 'accepted') {
        friends.push({
          friendshipId: f._id,
          _id: friend._id,
          name: friend.name,
          email: friend.email,
          picture: friend.picture,
          uid: friend.uid,
          role: friend.role
        });
      } else if (f.status === 'pending') {
        if (isRequester) {
          pendingOutgoing.push({
            friendshipId: f._id,
            _id: friend._id,
            name: friend.name,
            email: friend.email,
            picture: friend.picture,
            uid: friend.uid
          });
        } else {
          pendingIncoming.push({
            friendshipId: f._id,
            _id: friend._id,
            name: friend.name,
            email: friend.email,
            picture: friend.picture,
            uid: friend.uid
          });
        }
      }
    });

    res.json({ friends, pendingIncoming, pendingOutgoing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send friend request by UID
export const sendFriendRequest = async (req, res) => {
  try {
    const { uid } = req.body;
    const requesterId = req.user._id;

    if (!uid) {
      return res.status(400).json({ message: 'UID tag is required' });
    }

    // Find recipient by UID
    const recipient = await User.findOne({ uid: uid.trim() });
    if (!recipient) {
      return res.status(404).json({ message: 'User not found with this UID' });
    }

    const recipientId = recipient._id;

    if (requesterId.toString() === recipientId.toString()) {
      return res.status(400).json({ message: 'You cannot add yourself as a friend' });
    }

    // Check if friendship already exists
    const existing = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ message: 'You are already friends' });
      } else if (existing.status === 'pending') {
        return res.status(400).json({ message: 'A pending request already exists between you' });
      } else {
        // If declined before, reset to pending
        existing.status = 'pending';
        existing.requester = requesterId;
        existing.recipient = recipientId;
        await existing.save();
        return res.json({ message: 'Friend request sent successfully!', friendship: existing });
      }
    }

    const friendship = await Friendship.create({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    res.status(201).json({ message: 'Friend request sent successfully!', friendship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Respond to friend request (accept/decline)
export const respondFriendRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'declined'
    const friendshipId = req.params.id;
    const userId = req.user._id;

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status response' });
    }

    const friendship = await Friendship.findById(friendshipId);
    if (!friendship) {
      return res.status(404).json({ message: 'Friendship request not found' });
    }

    // Only recipient can accept/decline
    if (friendship.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    friendship.status = status;
    await friendship.save();

    res.json({ message: `Friend request ${status === 'accepted' ? 'accepted' : 'declined'} successfully!`, friendship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
