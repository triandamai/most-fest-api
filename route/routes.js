"use strict";

module.exports = app => {
  var user = require("../controller/controller_user");
  var admin = require("../controller/controller_admin");
  var kajian = require("../controller/controller_public");
  var auth = require("../controller/auth");
  var verifikasi = require("../controller/verifikasi");

  app.route("/").get(user.index);
  app.route("/login").post(auth.auth);
  app.route("/register").post(auth.register);
  app.route("/verifikasi/:token").get(verifikasi.verifikasi);
  app.route("/uploadBukti").post(verifikasi.uploadImageVerification);

  app.route("/users").get(user.getAllUsers);
  app.route("/users/:id_user").get(user.findUser);
};
