import express from "express";

const app = express();
const port = 5000; // The port your express server will be running on.


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;