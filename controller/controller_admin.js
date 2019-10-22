"use strict";

const response = require("../global/response");
const connection = require("../databases/database");
const fs = require("fs");
var buffer = require("buffer");
var path = require("path");
var multer = require("multer");

var qrcode = require("qrcode");

var TABLE_USER = "user";
var TABLE_ABSEN = "absens";
var TABLE_ADMIN = "admin";
var MESSAGE_SUCCESS = "Operasi Sukses !";
var MESSAGE_FAILED = "Operasi Gagal ?";
var MESSAGE_ERROR = "Error :";

exports.simpanAbsensi = (req, res) => {
  var id_user = req.body.id_user;

  var id = new Date().getTime();
  var __id = "AB-" + id;
  connection.query(
    "INSERT INTO " +
      TABLE_ABSEN +
      " (id_absensi,id_user,waktu_masuk,status) VALUES(?,?,?,?)",
    [__id, id_user, id, "hadir"],
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : response.ok(result, res, MESSAGE_SUCCESS);
    }
  );
};

exports.generateQR = (req, res) => {
  getQr();
};

async function getQr() {
  const res = await qrcode.toDataURL("http://hehe");

  fs.writeFileSync("./qr.html", '<img src="${res}">');
}
