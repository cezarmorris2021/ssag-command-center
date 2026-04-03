const express = require("express");
const app = express();

app.use(express.json());

let deals = [];

// Home
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>SSAG Command Center</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #050505;
            color: #00f5d4;
            text-align: center;
            padding: 14px;
            margin: 0;
          }
          h1 { font-size: 34px; margin: 18px 0; }
          .wrap { max-width: 900px; margin: 0 auto; }
          .box {
            border: 1px solid #00f5d
