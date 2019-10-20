"use strict";

// var data ={
//   success : "true/false",
//   data : {
//     datanya
//   },
//   values : [
//     {

//     }
//   ],
//   message : ""
// }

exports.ok = (values, res, msg) => {
  var data = {
    success: true,
    data: values,
    status: 200,
    message: msg
  };
  //console.log(values);
  res.json(data);
  res.end();
};
exports.exception = (values, res, msg) => {
  var data = {
    success: false,
    data: values,
    status: 403,
    message: msg
  };
};

exports.failed = (values, res, msg) => {
  var data = {
    success: false,
    data: [],
    status: 400,
    message: msg
  };

  res.json(data);
  res.end();
};
