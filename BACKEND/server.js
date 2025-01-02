const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const shortid = require("shortid");
const mongoose = require("mongoose");
const cors = require("cors"); // <-- Import CORS

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors()); // <-- Enable CORS
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Something went wrong in Connection: ", error));

// URL Schema
const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
});

const Url = mongoose.model("Url", urlSchema);

// API Route to shorten URL
app.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;
  const shortUrl = shortid.generate();

  const newUrl = new Url({
    longUrl,
    shortUrl,
  });

  try {
    await newUrl.save();
    res.json({ shortUrl: `http://localhost:5000/${shortUrl}` });
  } catch (error) {
    res.status(500).json({ message: "Error while saving the URL." });
  }
});

// Route to redirect from shortened URL
app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findOne({ shortUrl });

    if (url) {
      res.redirect(url.longUrl); // Redirecting to the long URL
    } else {
      res.status(404).send("URL Not Found");
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
