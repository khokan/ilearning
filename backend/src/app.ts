
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { planRoutes } from "./app/modules/plans/plan.route";
import { subsriptionRotes } from "./app/modules/subscriptions/subscription.route";
import { userRouter } from "./app/modules/users/users.route";
import { aiLearnRoutes } from "./app/modules/ailearn/ailearn.route";
import { PaymentController } from "./app/modules/payment/payment.controller";
import { RagRoutes } from "./app/modules/rag/rag.route";

const app = express();


app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent)

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // client side url
    credentials: true
}))

// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    ].filter(Boolean); // Remove undefined values


app.use(
    cors({
    origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    // Check if origin is in allowedOrigins or matches Vercel preview pattern
    const isAllowed =
    allowedOrigins.includes(origin) ||
    /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
    /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment
    if (isAllowed) {
    callback(null, true);
    } else {
    callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
    }),
);

app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json());

// Better auth handler
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/ai", aiLearnRoutes);

app.use("/api/plans", planRoutes);

app.use("/api/subscriptions", subsriptionRotes);

app.use("/api/users", userRouter);

app.use("/api/rag", RagRoutes);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));


// Basic route
app.get("/", async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "API is working",
  });
});

export default app;
