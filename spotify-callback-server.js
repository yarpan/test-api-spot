const express = require("express");
const app = express();
const PORT = 8888;

// Route to handle Spotify OAuth callback
app.get("/callback", (req, res) => {
  const authCode = req.query.code;
  const error = req.query.error;

  if (error) {
    res.send(`
            <p>Error: ${error}</p>
        `);
    return;
  }

  if (authCode) {
    res.send(`${authCode}`);
  } else {
    res.send(`
            <p>The callback didn't receive an authorization code. Please try again.</p>
        `);
  }
});

// Health check route
app.get("/", (req, res) => {
  res.send(`
        <h2>Spotify OAuth Callback Server</h2>
        <p>Server is running on port ${PORT}</p>
    `);
});

app.listen(PORT, () => {
  console.log(
    `🎵 Spotify OAuth callback server running on http://localhost:${PORT}`
  );
  console.log(`📡 Callback URL: http://localhost:${PORT}/callback`);
  console.log(
    `\n⚠️  Make sure this callback URL is registered in your Spotify App settings!`
  );
  console.log(
    `\n🔄 Keep this server running while completing the OAuth flow...`
  );
});
