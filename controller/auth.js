"use strict";

const response = require("../global/response");
const connection = require("../databases/database");
const async = require("async");
const crypto = require("crypto");
var nodeMailer = require("nodemailer");
const path = require("path");
//use express module
var express = require("express");
var app = express();
var hbs = require("hbs");

var TABLE_USER = "user";
var TABLE_KAJIAN = "";
var TABLE_VALIDASI = "validasi";
var TABLE_DETAIL_USER = "";
var TABLE_ADMIN = "admin";
var MESSAGE_SUCCESS = "Operasi Sukses !";
var MESSAGE_FAILED = "Operasi Gagal ?";
var MESSAGE_ERROR = "Error :";

exports.auth = (req, res) => {
  var user = req.body.user;
  var pass = req.body.password;

  if (user == "trian" && pass == "123456") {
    response.ok({ user: user, pass: pass }, res, MESSAGE_SUCCESS);
  } else {
    response.failed("", res, MESSAGE_FAILED);
  }
};
/*
id dari timestamp 
*/
exports.register = (req, res) => {
  var username = req.body.email;
  var password = req.body.password;
  var nama = req.body.nama;
  var nohp = req.body.nohp;
  var id = new Date().getTime();
  var __id = "MF-" + id;
  var token = new Buffer.from(__id);
  var __token = token.toString("base64");
  // console.log(cek);
  connection.query(
    "SELECT * FROM " + TABLE_USER + " WHERE email=?",
    [username],
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : result.length >= 1
        ? response.failed("", res, MESSAGE_ERROR + "Email Sudah DIgunakan")
        : connection.query(
            "INSERT INTO " +
              TABLE_USER +
              "(id_user,nama,nohp,email,password,level,status,token) VALUES (?,?,?,?,?,?,?,?)",
            [__id, nama, nohp, username, password, "user", "deactive", __token],
            (err, result, fields) => {
              err
                ? response.failed("", res, MESSAGE_ERROR + err.message)
                : sendEmail(req, res, __token);
            }
          );
    }
  );
};

exports.index = (req, res) => {
  var data = {
    status: 200,
    message: "Selamat Datang"
  };

  res.json(data);
  res.end();
};

function sendEmail(req, res, id) {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "triannurizkillah@gmail.com",
      pass: "asdf1998Buka12345"
    }
  });
  let mailOptions = {
    from: '"most-fest" <xx@gmail.com>', // sender address
    to: req.body.email, // list of receivers
    subject: "Verifikasi Akun", // Subject line
    text: "halo", // plain text body
    html:
      "<b>Silahkan klik link berikut <a href='http://localhost:3000/verification/" +
      id +
      "'>klik disini</a></b>"
    // html body
  };

  transporter.sendMail(mailOptions, (err, info) => {
    err
      ? response.failed("", res, MESSAGE_ERROR + err.message)
      : response.ok(info, res, MESSAGE_SUCCESS);
  });
}
