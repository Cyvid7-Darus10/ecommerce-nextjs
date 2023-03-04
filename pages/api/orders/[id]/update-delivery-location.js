import { getSession } from "next-auth/react";
import Order from "../../../../models/Order";
import db from "../../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("Error: signin required");
  }
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.currentLocation = req.body.delivery_location;
    const updatedOrder = await order.save();
    await db.disconnect();
    res.send({
      success: true,
      message: "order delivery location updated successfully",
      order: updatedOrder,
    });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Error: order not found" });
  }
};

export default handler;
