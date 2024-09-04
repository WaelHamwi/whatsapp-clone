import { type } from "os";
import path from "path";
import getPrismaInstance from "../utils/PrismaClient.js";
import { renameSync } from "fs";
export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { message, from, to } = req.body;
    const getUser = onlineUsers.get(to); //we want to get the online users to set the message as delivered not sent
    if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          message,
          sender: { connect: { id: parseInt(from) } },
          receiver: { connect: { id: parseInt(to) } },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: { sender: true, receiver: true },
      });
      return res.status(201).send({ message: newMessage });
    }
    return res.status(400).send("Message, sender, receiver are all required.");
  } catch (error) {
    next(error);
  }
};
export const getMessages = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { from, to } = req.params;

    // Retrieve all messages between the two users, either as sender or receiver
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(from),
            receiverId: parseInt(to),
          },
          {
            senderId: parseInt(to),
            receiverId: parseInt(from),
          },
        ],
      },
      orderBy: {
        id: "asc", // Order messages by ascending ID
      },
    });

    const unreadMessages = []; // Initialize an array for unread messages

    // Iterate over the messages to find unread ones
    messages.forEach((message, index) => {
      if (
        message.messageStatus !== "read" && // If the message is not read
        message.senderId === parseInt(to) // And the sender is the recipient in this conversation
      ) {
        messages[index].messageStatus = "read"; // Mark the message as read
        unreadMessages.push(message.id); // Add the message ID to the unreadMessages array
      }
    });

    // Update the status of unread messages to 'read' in the database
    if (unreadMessages.length > 0) {
      await prisma.messages.updateMany({
        where: {
          id: { in: unreadMessages }, // Use `in` to update all unread messages at once
        },
        data: { messageStatus: "read" }, // Set the status to read
      });
    }

    res.status(200).json({ messages }); // Send the updated messages back to the client
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      const originalName = req.file.originalname;
      const extension = path.extname(originalName);
      const baseName = path.basename(originalName, extension);

      const fileName = `uploads/images/${baseName}_${date}${extension}`;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;
      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: parseInt(from) } },
            receiver: { connect: { id: parseInt(to) } },
            type: "image",
          },
        });
        return res.status(201).json({ message });
      }

      return res.status(400).json("sender, receiver are required.");
    }
    return res.status(400).json("Image is required.");
  } catch (error) {
    next(error);
  }
};

export const addAudioMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      const originalName = req.file.originalname;
      const extension = path.extname(originalName);
      const baseName = path.basename(originalName, extension);

      const fileName = `uploads/recordings/${baseName}_${date}${extension}`;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;
      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: parseInt(from) } },
            receiver: { connect: { id: parseInt(to) } },
            type: "audio",
          },
        });
        return res.status(201).json({ message });
      }

      return res.status(400).json("sender, receiver are required.");
    }
    return res.status(400).json("The audio is required.");
  } catch (error) {
    next(error);
  }
};


export const getInitContactMessages = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.from);
    const prisma = getPrismaInstance();

    // Fetch the user and include the messages they've sent and received
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentMessages: {
          include: {
            receiver: true,
            sender: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        receivedMessages: {
          include: {
            receiver: true,
            sender: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const messages = [...user.sentMessages, ...user.receivedMessages];

    // Sort messages by creation date in descending order
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const users = new Map();
    const messageStatusChange = [];

    messages.forEach((msg) => {
      const isSender = msg.senderId === userId;
      const contactId = isSender ? msg.receiverId : msg.senderId;

      // Only add to messageStatusChange if the current status is 'sent'
      if (msg.messageStatus === "sent") {
        messageStatusChange.push(msg.id);
      }

      const {
        id,
        type,
        senderId,
        receiverId,
        message,
        messageStatus,
        createdAt,
      } = msg;

      if (!users.get(contactId)) {
        let userMessageData = {
          id,
          type,
          senderId,
          receiverId,
          message,
          messageStatus,
          createdAt,
        };

        if (isSender) {
          userMessageData = {
            ...userMessageData,
            ...msg.receiver,
            totalUnreadMessages: 0,
          };
        } else {
          userMessageData = {
            ...userMessageData,
            ...msg.sender,
            totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
          };
        }

        users.set(contactId, { ...userMessageData });
      } else if (messageStatus !== "read" && !isSender) {
        const existingUser = users.get(contactId);
        users.set(contactId, {
          ...existingUser,
          totalUnreadMessages: existingUser.totalUnreadMessages + 1,
        });
      }
    });

    // If there are any messages that need their status updated
    if (messageStatusChange.length) {
      await prisma.messages.updateMany({
        where: {
          id: { in: messageStatusChange }, // Update all unread messages at once
        },
        data: { messageStatus: "delivered" },
      });
    }

    return res.status(200).json({
      users: Array.from(users.values()),
      onlineUsers: Array.from(onlineUsers.keys()), // Ensure onlineUsers is defined elsewhere
    });
  } catch (error) {
    // Handle any unexpected errors
    next(error);
  }
};
