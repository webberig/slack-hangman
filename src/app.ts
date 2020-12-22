import express from "express";

export const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.get("/", (req, res) => {
  res.write("Hello, world");
  res.end();
});
