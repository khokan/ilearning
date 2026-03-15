
import express from "express";
 
const app = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

const bootstrap = () => {
    try {
        app.listen(5000, () => {
            console.log(`Server is running on http://localhost:5000`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

bootstrap();