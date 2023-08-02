//import library
const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../auth");

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const model = require("../models/index");
const meja = model.meja;

// mengambil semua data meja
app.get("/getAllData", auth, async (req, res) => {
  await meja
    .findAll({
      order: [["id_meja", "DESC"]],
    })
    .then((result) => { // jika berhasil
      res.status(200).json({
        status: "success",
        data: result,
      });
    })
    .catch((error) => { // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

// get data by id meja
app.get("/getById/:id", auth, async (req, res) => {
  await meja
    .findByPk(req.params.id) // mengambil data meja berdasarkan id meja yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      if (result) {
        res.status(200).json({ // mengembalikan response dengan status code 200 dan data meja
          status: "success",
          data: result,
        });
      } else { // jika data tidak ditemukan
        res.status(404).json({
          status: "error",
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => { // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

// get meja by status
app.get("/getByStatus/:status", auth, async (req, res) => { // endpoint untuk mengambil data meja berdasarkan status meja
  const param = { status: req.params.status }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  await meja
    .findAll({ where: param }) // mengambil data meja berdasarkan status meja yang dikirimkan melalui parameter
    .then((result) => {
      if (result) { // jika data ditemukan
        res.status(200).json({
          status: "success",
          data: result,
        });
      } else { // jika data tidak ditemukan
        res.status(404).json({
          status: "error",
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => { // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

// create meja
app.post("/create", async (req, res) => {
  const data = {
    nomor_meja: req.body.nomor_meja,
    status: "kosong"
  };
  await meja
    .findOne({ where: { nomor_meja: data.nomor_meja } }) // mengambil data meja berdasarkan nomor meja yang dikirimkan
    .then((result) => {
      if (result) { // jika nomor meja sudah ada
        res.status(400).json({
          status: "error",
          message: "nomor meja sudah ada",
        });
      } else { // jika nomor meja belum ada
        meja
          .create(data)
          .then((result) => {
            res.status(200).json({
              status: "success",
              message: "meja berhasil ditambahkan",
              data: result,
            });
          })
          .catch((error) => {
            res.status(400).json({
              status: "error",
              message: error.message,
            });
          });
      }
    });
});

// delete meja
app.delete("/delete/:id_meja", auth, async (req, res) => {
  const param = { id_meja: req.params.id_meja };
  // delete data
  meja
    .destroy({ where: param })
    .then((result) => {
      if (result) { // jika data ditemukan
        res.status(200).json({
          status: "success",
          message: "meja berhasil dihapus",
          data: param,
        });
      } else { // jika data tidak ditemukan
        res.status(404).json({
          status: "error",
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => { // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

// edit meja
app.patch("/edit/:id_meja", auth, async (req, res) => {
  const param = { id_meja: req.params.id_meja };
  const data = {
    nomor_meja: req.body.nomor_meja,
    status: req.body.status,
  };

  meja.findOne({ where: param }).then((result) => {
    if (result) { // jika data ditemukan
      if (data.nomor_meja != null) { // jika nomor meja tidak kosong
        meja
          .findOne({ where: { nomor_meja: data.nomor_meja } }) // mengambil data meja berdasarkan nomor meja yang dikirimkan melalui body request
          .then((result) => {
            if (result) { // jika nomor meja sudah ada
              res.status(400).json({
                status: "error",
                message: "nomor meja sudah ada",
              });
            } else { // jika nomor meja belum ada
              meja
                .update(data, { where: param })
                .then((result) => { // jika berhasil
                  res.status(200).json({
                    status: "success",
                    message: "data berhasil diubah",
                    data: { // mengembalikan data yang telah diubah
                      id_meja: param.id_meja,
                      nomor_meja: data.nomor_meja,
                    },
                  });
                })
                .catch((error) => { // jika gagal
                  res.status(400).json({
                    status: "error",
                    message: error.message,
                  });
                });
            }
          });
      } else { // jika data nomor meja kosong
        meja
          .update(data, { where: param })
          .then((result) => { // jika berhasil
            res.status(200).json({ 
              status: "success",
              message: "data berhasil diubah",
              data: {
                nomor_meja: data.nomor_meja,
              },
            });
          })
          .catch((error) => { // jika gagal
            res.status(400).json({ 
              status: "error",
              message: error.message,
            });
          });
      }
    } else { // jika data tidak ditemukan
      res.status(404).json({
        status: "error",
        message: "data tidak ditemukan",
      });
    }
  });
});

// search meja
app.get("/search/:nomor_meja", auth, async (req, res) => { // endpoint untuk mencari data meja berdasarkan nomor meja
  meja
    .findOne({ // mengambil data meja berdasarkan nomor meja yang dikirimkan melalui parameter
      where: {
        nomor_meja: req.params.nomor_meja,
      },
    })
    .then((result) => { // jika berhasil
      if(result == null){ // jika data tidak ditemukan
        res.status(404).json({
          status: "error",
          message: "data tidak ditemukan",
        });
      } else { // jika data ditemukan
        res.status(200).json({
          status: "success",
          message: "hasil dari pencarian nomor meja " + req.params.nomor_meja,
          data: result,
        });
      }
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ 
        status: "error",
        message: error.message,
      });
    });
});

module.exports = app;