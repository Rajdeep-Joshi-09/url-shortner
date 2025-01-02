import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [theme, setTheme] = useState("light"); // Dark mode state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/shorten", {
        longUrl,
      });
      setShortUrl(response.data.shortUrl);
    } catch (error) {
      console.error("Error shortening the URL: ", error);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl); // Copy the URL to clipboard
    alert("URL copied to clipboard!"); // Optional: Show a message to the user
  };

  useEffect(() => {
    // Toggle the class "dark" on the document's body element to activate dark mode styles
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div
      className={`h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-all duration-300`}
    >
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            URL Shortener
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-white focus:outline-none"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter long URL"
            required
            className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Shorten
          </button>
        </form>

        {shortUrl && (
          <div className="mt-6">
            <p className="text-gray-800 dark:text-white">Shortened URL:</p>
            <div className="flex items-center space-x-3">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline dark:text-blue-400"
              >
                {shortUrl}
              </a>
              <button
                onClick={handleCopy}
                className="p-2 bg-gray-300 dark:bg-gray-600 rounded-md text-gray-700 dark:text-white"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
