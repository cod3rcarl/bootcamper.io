const mongoose = require("mongoose");
const connectDB = async () => {
  //mongoose.connect returns a promise
  // MONGO_URI is brought in from MongoDB website connect from the cluster. remember to add to config file
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    //following need to be added as options to stop warnings in the console
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
