const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.magenta.bold);
  } catch (error) {
    console.log(`MongoDB Connection Failed: ${error}`.brightRed.bold);
  }
};

module.exports = connectDB;
