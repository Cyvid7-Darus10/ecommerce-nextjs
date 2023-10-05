import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";

async function handler(req, res) {
    const { provider } = req.body;

    const { userName, firstName, lastName, email, password } = req.body;

    // If provider is not Google, validate the password
    if (provider !== "google" && (!password || password.trim().length < 5)) {
        return res
            .status(422)
            .json({ message: "Validation error: Password is required" });
    }

    // For other validations which are common
    if (
        !userName ||
        !firstName ||
        !lastName ||
        !email ||
        !email.includes("@")
    ) {
        return res.status(422).json({ message: "Validation error" });
    }

    await db.connect();

    // Assuming the session's user object has an _id field
    const toUpdateUser = await User.findOne({ email: email });

    if (!toUpdateUser) {
        await db.disconnect();
        return res.status(404).send({ message: "User not found" });
    }

    toUpdateUser.userName = userName;
    toUpdateUser.firstName = firstName;
    toUpdateUser.lastName = lastName;
    toUpdateUser.email = email;

    // If provider is not Google, and password is provided and different from the current one, update it
    if (
        provider !== "google" &&
        password &&
        !bcryptjs.compareSync(password, toUpdateUser.password)
    ) {
        toUpdateUser.password = bcryptjs.hashSync(password);
    }

    await toUpdateUser.save();
    await db.disconnect();

    return res.send({
        message: "User updated",
    });
}

export default handler;
