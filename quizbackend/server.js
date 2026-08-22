
require("dotenv").config();

const app = require("./app.js");
const connectDb = require("./src/db/db.js");
const port = Number(process.env.PORT) || 3000;






const startServer = async () => {
  
  try {
    await connectDb();

    app.listen(port, () => {
      console.log(`server started at ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

