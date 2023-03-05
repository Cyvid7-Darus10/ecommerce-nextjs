import { getSession } from "next-auth/react";
import Order from "../../../../models/Order";
import db from "../../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("signin required");
  }
  if (req.method === "GET") {
    await db.connect();
    const ordersWithRefunds = await Order.find({
      orderItems: { $elemMatch: { refund: true } },
    }).populate("user", "firstName lastName");
    await db.disconnect();
    res.send(ordersWithRefunds);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

export default handler;
