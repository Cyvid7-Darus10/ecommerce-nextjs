import User from "../../models/User";
import db from "../../utils/db";
import bcryptjs from "bcryptjs";

async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { token, newPassword } = req.body;

    if (!token || !newPassword || newPassword.trim().length < 5) {
        return res
            .status(422)
            .json({ message: "Invalid token or password.", newPassword });
    }

    try {
        await db.connect();

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            await db.disconnect();
            return res
                .status(400)
                .json({ message: "Token is invalid or has expired." });
        }

        user.password = bcryptjs.hashSync(newPassword);
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiry = undefined;

        await user.save();

        await db.disconnect();

        res.send({
            message: "Password has been reset.",
        });
    } catch (error) {
        console.error(error);
        if (db.isConnected()) {
            await db.disconnect();
        }
        res.status(500).json({
            message: "Failed to reset password. Please try again later.",
        });
    }
}

export default handler;
