import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const { userName, firstName, lastName, email, password } = req.body;
  if (
    !userName ||
    !firstName ||
    !lastName ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: "Validation error",
    });
    return;
  }

  await db.connect();

  const existingUserEmail = await User.findOne({ email: email });
  if (existingUserEmail) {
    res.status(422).json({ message: "Email exists already!" });
    await db.disconnect();
    return;
  }

  const existingUserName = await User.findOne({ userName: userName });
  if (existingUserName) {
    res.status(422).json({ message: "Username exists already!" });
    await db.disconnect();
    return;
  }

  const newUser = new User({
    userName,
    firstName,
    lastName,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  });

  const user = await newUser.save();
  await db.disconnect();
  res.status(201).send({
    message: "Created user!",
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}

export default handler;
