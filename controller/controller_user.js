"use strict";

const response = require("../global/response");
const connection = require("../databases/database");
const fs = require("fs");
var buffer = require("buffer");
var path = require("path");
var multer = require("multer");

var TABLE_USER = "user";
var TABLE_KAJIAN = "";
var TABLE_VALIDASI = "validasi";
var TABLE_DETAIL_USER = "";
var TABLE_ADMIN = "admin";
var MESSAGE_SUCCESS = "Operasi Sukses !";
var MESSAGE_FAILED = "Operasi Gagal ?";
var MESSAGE_ERROR = "Error :";

exports.getAllUsers = (req, res) => {
  connection.query("SELECT * FROM " + TABLE_USER, [], (err, result, fields) => {
    err
      ? response.failed("", res, MESSAGE_ERROR + err.message)
      : response.ok(result, res, MESSAGE_SUCCESS);
  });
};

exports.findUser = (req, res) => {
  connection.query(
    "SELECT * FROM " + TABLE_USER + " WHERE id_user=?",
    [req.params.id_user],
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : response.ok(result, res, MESSAGE_SUCCESS);
    }
  );
};

exports.changePassword = (req, res) => {
  connection.query(
    "UPDATE " + TABLE_USER + " SET password=? WHERE id_user=?",
    [req.body.newpassword, req.body.id_user],
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : response.ok(result, res, MESSAGE_SUCCESS);
    }
  );
};

exports.updateFoto = (req, res) => {};
exports.updateUser = (req, res) => {
  connection.query(
    "UPDATE " + TABLE_USER + " SET nama=?, nohp=? WHERE id_user=?",
    [req.body.nama, req.body.nohp, req.body.id_user],
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : response.ok(result, res, MESSAGE_SUCCESS);
    }
  );
};

exports.detetUser = (req, res) => {
  connection.query(
    "DELETE FROM " + TABLE_USER + " WHERE id_user=?",
    [req.body.id_user],
    (err, result, fileds) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : response.ok(result, res, MESSAGE_SUCCESS);
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
