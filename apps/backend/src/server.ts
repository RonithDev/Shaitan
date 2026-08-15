import app from './app.js';
import { prisma } from "./config/database.js";

const port = Number(process.env.PORT || 3000);

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();





/*app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); */
