"use strict";

module.exports = app => {
  var user = require("../controller/controller_user");
  var admin = require("../controller/controller_admin");
  var kajian = require("../controller/controller_public");
  var auth = require("../controller/auth");
  var verifikasi = require("../controller/verifikasi");

  app.route("/").get(user.index);
  app.route("/loginUser").post(auth.auth);
  app.route("/register").post(auth.register);
  app.route("/registerEmail").post(auth.kirimEmail);
  app.route("/verifikasi/:token").get(verifikasi.verifikasi);
  app.route("/aktivasi/:token").get(verifikasi.updateStatus);
  app.route("/uploadBukti").post(verifikasi.uploadImageVerification);

  app.route("/users").get(user.getAllUsers);
  app.route("/users/:id_user").get(user.findUser);
  app.route("/ubahPassword").post(user.changePassword);
  app.route("/requestNewEmail").post(auth.requestNewEmail);
  app.route("/cekEmail").post(auth.cekEmail);
  app.route("/updateProfil").post(user.updateUser);

  app.route("/prosesAbsensi").post(admin.simpanAbsensi);
  app.route("/generateQR").post(admin.generateQR);
  app.route("/listpendaftar").get(admin.getPendaftar);
  app.route("/listpeserta").get(admin.getPeserta);
  app.route("/loginAdmin").post(admin.loginAdmin);
  app.route("/infoBank").get(admin.getBank);
  app.route("/addBank").post(admin.saveBank);
  app.route("/updateBank").post(admin.updateBank);
  app.route("/accUser").post(admin.accPeserta);
};
