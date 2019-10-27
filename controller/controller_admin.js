"use strict";

const response = require("../global/response");
const connection = require("../databases/database");
const fs = require("fs");
var buffer = require("buffer");
var path = require("path");
var multer = require("multer");

const QRLogo = require("qr-with-logo");

var TABLE_USER = "user";
var TABLE_ABSEN = "absens";
var TABLE_BANK = "bank_info";
var TABLE_ADMIN = "admin";
var TABLE_QR = "qr_code";

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
  Qr(req, res);
};
async function Qr(req, res) {
  var token = new Buffer.from(req.body.id_user);
  var nama = req.body.nama;
  var tanggal_generate = new Date().getTime();
  var __token = token.toString("base64");

  const opts = {
    errorCorrectionLevel: "H",
    rendererOpts: { quality: 0.3 }
  };
  const data = JSON.stringify({
    name: nama,
    tanggal_buat: tanggal_generate,
    status: "Peserta",
    link: __token
  });

  await QRLogo.generateQRWithLogo(
    data,
    "public/logo.png",
    opts,
    "PNG",
    "public/qr_file/" + req.body.id_user + ".png"
  )
    .then(result => {
      connection.query(
        "INSERT INTO " +
          TABLE_QR +
          "(id_qr,tanggal_generate,code,detail) VALUES (?,?,?,?)",
        [token, tanggal_generate, data, __token],
        (err, resp, fields) => {
          err
            ? response.ok(
                { res: result, response: err.message },
                res,
                MESSAGE_ERROR + err.message
              )
            : response.ok(
                { res: result, response: resp },
                res,
                MESSAGE_SUCCESS
              );
        }
      );
    })
    .catch(err => {
      console.log(err);
      response.failed("", res, MESSAGE_ERROR + err.message);
    });
}
exports.accPeserta = (req, res) => {
  var id = req.body.id_user;
  var pembayaran = req.body.pembayaran;
  connection.query(
    "UPDATE " + TABLE_USER + " SET pembayaran=? WHERE id_user=?",
    [pembayaran, id],
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : response.ok(result, res, MESSAGE_SUCCESS);
    }
  );
};
exports.getPendaftar = (req, res) => {
  connection.query(
    "SELECT * FROM " + TABLE_USER + " WHERE bukti_transfer IS NULL",
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : response.ok(result, res, MESSAGE_SUCCESS);
    }
  );
};

exports.getPeserta = (req, res) => {
  connection.query(
    "SELECT * FROM " + TABLE_USER + " WHERE bukti_transfer IS NOT NULL",
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : response.ok(result, res, MESSAGE_SUCCESS);
    }
  );
};

/*
  [
    {
      id_bank_info : "",
      norek : "",
      atas_nama :"",
      nama_bank :"",
      kode_bank:""
    }
  ]
*/
exports.getBank = (req, res) => {
  connection.query("SELECT * FROM " + TABLE_BANK, (err, result, fields) => {
    err
      ? response.failed("", res, MESSAGE_ERROR + err.message)
      : response.ok(result, res, MESSAGE_SUCCESS);
  });
};

exports.loginAdmin = (req, res) => {
  connection.query(
    "SELECT * FROM " + TABLE_ADMIN + " WHERE username=? AND password=?",
    [req.body.email, req.body.password],
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : result.length >= 0
        ? response.ok(result, res, MESSAGE_SUCCESS)
        : response.failed("", res, MESSAGE_FAILED);
    }
  );
};

exports.saveAdmin = (req, res) => {
  connection.query(
    "INSERT INTO " +
      TABLE_ADMIN +
      " (id,username,password,level) VALUES (?,?,?,?)",
    [null, req.body.username, req.body.password, "admin"],
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : response.ok(result, res, MESSAGE_SUCCESS);
    }
  );
};

exports.saveBank = (req, res) => {
  var norek = req.body.norek;
  var atas_nama = req.body.atas_nama;
  var nama_bank = req.body.nama_bank;
  var kode_bank = req.body.kode_bank;
  connection.query(
    "INSERT INTO " +
      TABLE_BANK +
      " (id_bank_info,norek,atas_nama,nama_bank,kode_bank) VALUES (?,?,?,?,?)",
    [null, norek, atas_nama, nama_bank, kode_bank],
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : response.ok(result, res, MESSAGE_SUCCESS);
    }
  );
};

exports.updateBank = (req, res) => {
  var id = req.body.id_bank_info;
  var nama_bank = req.body.nama_bank;
  var atas_nama = req.body.atas_nama;
  var kode_bank = req.body.kode_bank;
  var norek = req.body.norek;
  connection.query(
    "UPDATE " +
      TABLE_BANK +
      " SET norek=?,atas_nama=?,nama_bank=?,kode_bank=? WHERE id_bank_info=?",
    [norek, atas_nama, nama_bank, kode_bank, id],
    (err, result, fields) => {
      err
        ? response.failed("", res, MESSAGE_ERROR + err.message)
        : response.ok(result, res, MESSAGE_SUCCESS);
    }
  );
};
