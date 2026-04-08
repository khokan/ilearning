import express from "express";
import { prisma } from "./lib/prisma";
import app from "./app";
import { seedSuperAdmin } from "./lib/seed";

const port = process.env.PORT || 5000; // The port your express server will be running on.


// Start the server
const bootstrap = async () => {
    try {
       await prisma.$connect();
       await seedSuperAdmin(); // Ensure the super admin is seeded before starting the server
        app.listen(port, () => {
            console.log(`Server is running on ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        await prisma.$disconnect();
    }
}

bootstrap();  
