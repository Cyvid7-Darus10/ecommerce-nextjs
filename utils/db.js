import mongoose from "mongoose";

const connection = {};

async function connect() {
    if (connection.isConnected) {
        console.log("already connected");
        return;
    }

    if (mongoose.connections.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;
        if (connection.isConnected === 1) {
            console.log("use previous connection");
            return;
        }
        await mongoose.disconnect();
    }

    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10, // Adjust this number as needed
    });

    mongoose.connection.on("connected", () => {
        console.log("Mongoose connected");
        connection.isConnected = true;
    });

    mongoose.connection.on("error", (err) => {
        console.error(`Mongoose connection error: ${err}`);
        connection.isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
        console.log("Mongoose disconnected");
        connection.isConnected = false;
    });
}

async function disconnect() {
    // if (connection.isConnected) {
    //     await mongoose.disconnect();
    //     console.log("Mongoose disconnected");
    //     connection.isConnected = false;
    // } else {
    //     console.log("not connected");
    // }
}

function convertDocToObj(doc) {
    doc._id = doc._id.toString();
    doc.createdAt = doc.createdAt.toString();
    doc.updatedAt = doc.updatedAt.toString();
    return doc;
}

const db = { connect, disconnect, convertDocToObj };
export default db;
