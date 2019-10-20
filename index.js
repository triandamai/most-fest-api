const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const routes = require("./route/routes");
const serveIndex = require("serve-index");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//app.use(express.json({ limit: "50mb" }));
//app.use(express.urlencoded({ limit: "50mb" }));

app.use(
  "/ftp",
  express.static("public"),
  serveIndex("public", { icons: true })
);
routes(app);
app.listen(port, (stat, err) => {
  console.log("localhost:" + port);
});
