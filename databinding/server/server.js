const express = require('express');
const PORT = process.env.PORT || 8080;
express().use(express.static('../client'))
    .listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));