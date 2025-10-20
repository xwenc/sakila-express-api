const app = require("./app");
const db = require("./models");
const port = 3000;

async function startServer() {
  try {
    // Test database connection
    if (process.env.NODE_ENV === "development") {
      await db.sequelize.sync({ alter: true });
      console.log("Database connection has been established successfully.");
    } else {
      await db.sequelize.sync();
    };
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
