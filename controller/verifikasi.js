"use strict";

const response = require("../global/response");
const connection = require("../databases/database");
const async = require("async");
const crypto = require("crypto");
var nodeMailer = require("nodemailer");
const path = require("path");
var multer = require("multer");

var TABLE_USER = "user";
var MESSAGE_SUCCESS = "Operasi Sukses !";
var MESSAGE_FAILED = "Operasi Gagal ?";
var MESSAGE_ERROR = "Error :";

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.body.uid);
    cb(null, "public/verification/");
  },
  filename: (req, file, cb) => {
    var __uid = Buffer.from(req.body.uid, "base64");
    console.log(req.body.uid);
    cb(null, __uid + ".jpg");
  }
});
var uploadOne = multer({
  storage: storage,
  limits: {
    fieldSize: 100000
  }
}).single("verifikasi_foto");

exports.uploadImageVerification = (req, res) => {
  uploadOne(req, res, err => {
    var uid = req.body.uid;
    var __uid = Buffer.from(uid, "base64");
    console.log(uid);
    if (err) {
      response.failed("", res, MESSAGE_ERROR + err.message);
    } else {
      connection.query(
        "UPDATE " +
          TABLE_USER +
          " SET bukti_transfer=?, token=? WHERE id_user=?",
        [__uid + ".jpg", "kosong", __uid],
        (err, result, fields) => {
          err
            ? response.failed("", res, MESSAGE_ERROR + err.message)
            : response.ok(result, res, MESSAGE_SUCCESS);
        }
      );
    }
  });
};

exports.verifikasi = (req, res) => {
  var user_uid = req.params.token;
  var __uid = Buffer.from(user_uid, "base64");
  var __token = user_uid;
  //console.log("uid" + __uid, "token" + __token);
  connection.query(
    "SELECT * FROM " + TABLE_USER + " WHERE id_user=? AND token=?",
    [__uid, __token],
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : result.length <= 0 || result.length >= 2
        ? response.failed([], res, MESSAGE_FAILED)
        : updateStatus(__uid, res);
    }
  );
};

function updateStatus(id, res) {
  connection.query(
    "UPDATE " + TABLE_USER + " set status=? WHERE id_user=?",
    ["aktif", id],
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : response.ok(result, res, MESSAGE_SUCCESS);
    }
  );
}
