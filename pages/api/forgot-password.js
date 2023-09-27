import User from "../../models/User";
import db from "../../utils/db";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";

// Set the SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { email } = req.body;

    if (!email || !email.includes("@")) {
        return res.status(422).json({ message: "Invalid email." });
    }

    try {
        await db.connect();

        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(404)
                .json({ message: "No account found with that email." });
        }

        // Generate a reset token and set its expiration
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

        try {
            user.resetPasswordToken = resetToken;
            user.resetPasswordTokenExpiry = resetTokenExpiry;
            await user.save();
        } catch (error) {
            return res.status(500).json({ message: "Failed to update user." });
        }

        // Send email to user with reset link containing the token
        const msg = {
            to: email,
            from: "cabsfour39@gmail.com",
            subject: "Password Reset Request",
            text: `Please use the following link to reset your password: ${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`,
            html: `<strong>Please use the following link to reset your password:</strong> <a href="${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}">Reset Password</a>`,
        };

        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: "Failed to send the email.", error });
        }

        await db.disconnect();

        res.send({
            message: "Password reset link sent to email.",
            email: email,
            user: user,
            schema: User,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to process request." });
    }
}

export default handler;
