const express = require("express");

const PORT = 8080;

const app = express();
app.use(express.static('public', { extensions: ['js'] }));
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}/`));
