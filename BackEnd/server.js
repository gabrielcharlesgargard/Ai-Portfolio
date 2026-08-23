import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import communityRouter from "./routes/community.routes.js";
import paymentRouter from "./routes/payment.routes.js";



const PORT = 3000;
const app = express();


// MiddleWare
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));


// DB Connection
connectDB();



// Routes
app.use("/api/auth", authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/community', communityRouter);
app.use('/api/payments', paymentRouter);



app.get("/", (req, res) => {
  res.send("api working");
});

app.listen(PORT, () => {
  console.log(`server is working on Port number ${PORT}`);
});
