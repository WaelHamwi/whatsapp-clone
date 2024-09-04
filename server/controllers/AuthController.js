import getPrismaInstance from "../utils/PrismaClient.js";
import { generateToken04 } from "../utils/TokenGenerator.js";
export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ msg: "Email is required", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ msg: "User not found", status: false });
    } else {
      // Return user information along with the success status
      return res.json({
        msg: "User found",
        status: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          status: user.status,
        },
      });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return res
      .status(500)
      .json({ msg: "Internal server error", status: false });
  }
};

export const onBoardUser = async (req, res, next) => {
  try {
    const { email, name, about, image: profilePicture } = req.body;

    if (!email || !name || !profilePicture) {
      return res
        .status(400)
        .json({ msg: "Email, name, and image are all required." });
    }

    const prisma = getPrismaInstance();

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with this email already exists." });
    }

    // Create the new user if the email is not already used
    const user = await prisma.user.create({
      data: { email, name, about, profilePicture },
    });

    return res.json({ msg: "Successfully added", status: true, user });
  } catch (error) {
    next(error);
  }
};
export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        about: true,
        profilePicture: true,
      },
    });
    const usersGroupByletter = {};
    console.log(users);
    users.forEach((user) => {
      const initLetter = user.name.charAt(0).toUpperCase();
      if (!usersGroupByletter[initLetter]) {
        usersGroupByletter[initLetter] = [];
      }
      usersGroupByletter[initLetter].push(user);
    });
    return res.status(200).send({ users: usersGroupByletter }); // outside the for to fetch them all
  } catch (error) {
    next(error);
  }
};

export const generateToken = (req, res, next) => {
  try {
    const appId = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_ID; 
    const userId = req.params.userId;
    const effectiveTime = 3600;
    const payload = "";

    if (appId && serverSecret && userId) {
      const token = generateToken04(
        appId,
        userId,
        serverSecret,
        effectiveTime,
        payload
      );
      return res.status(200).json({ token });
    } else {
      return res
        .status(400)
        .send("user id, app id and server secret are required.");
    }
  } catch (error) {
    next(error);
  }
};
