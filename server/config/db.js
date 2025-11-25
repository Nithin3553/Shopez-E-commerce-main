import mongoose from "mongoose";

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGOBD_URL)

        console.log('MongoDB Connected successfully');
    } catch (err) {

        console.log(`Error Message : ${err.message}`);
        process.exit(1);

    }

};

export default connectDB;