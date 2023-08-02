//import library
const express = require("express"); 
const bodyParser = require("body-parser");
const auth = require("../auth");
const { Op } = require("sequelize");
const multer = require("multer"); // import library multer untuk upload file
const path = require("path"); // import library path untuk mengambil ekstensi file
const fs = require("fs"); // import library fs untuk menghapus file

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

//import model
const model = require("../models/index");
const menu = model.menu; // inisialisasi model meja

//config storage image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/image"); // folder penyimpanan file
  },
  filename: (req, file, cb) => {
    cb(null, "img-" + Date.now() + path.extname(file.originalname)); // nama file
  },
});
let upload = multer({ storage: storage }); // inisialisasi konfigurasi penyimpanan file

// mengambil semua data menu
app.get("/getAllData",auth, async (req, res) => {
  await menu
    .findAll({
      order: [["id_menu", "DESC"]],
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

// get data by id menu
app.get("/getById/:id", auth, async (req, res) => {
  await menu
    .findByPk(req.params.id) // mengambil data menu berdasarkan id menu yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      if (result) {
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

// get data by jenis 
app.get("/getByJenis/:jenis", auth, async (req, res) => {
  await menu
    .findAll({ where: { jenis: req.params.jenis } }) // mengambil data makanan berdasarkan jenis yang dikirimkan melalui parameter
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

// create menu
app.post("/create", upload.single("gambar"), auth, async (req, res) => {
  const data = { // inisialisasi data yang akan dikirimkan melalui body request
    nama_menu: req.body.nama_menu,
    jenis: req.body.jenis,
    deskripsi: req.body.deskripsi,
    gambar: req.file.filename,
    harga: req.body.harga,
  };
  await menu
    .findOne({ where: { nama_menu: data.nama_menu } }) // mengambil data menu berdasarkan nama menu yang dikirimkan
    .then((result) => {
      if (result) { // jika nama menu sudah ada
        res.status(400).json({
          status: "error",
          message: "nama menu sudah ada",
        });
      } else { // jika nama menu belum ada
        menu
          .create(data)
          .then((result) => { 
            res.status(200).json({
              status: "success",
              message: "menu berhasil ditambahkan",
              data: result,
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
});

// delete menu
app.delete("/delete/:id_menu",  async (req, res) => {
  const param = { id_menu: req.params.id_menu }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  menu
    .destroy({ where: param }) // menghapus data menu berdasarkan id menu
    .then((result) => { // jika berhasil
      if (result) { 
        res.status(200).json({
          status: "success",
          message: "menu berhasil dihapus",
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

// edit menu
app.patch("/edit/:id_menu", upload.single("gambar"), auth, async (req, res) => {
  const param = { id_menu: req.params.id_menu }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  const data = { // inisialisasi data yang akan diubah
    nama_menu: req.body.nama_menu,
    jenis: req.body.jenis,
    deskripsi: req.body.deskripsi,
    harga: req.body.harga,
    resultArr: {},
  };

  menu.findOne({ where: param }).then((result) => { // mengambil data menu berdasarkan id menu yang dikirimkan melalui parameter
    if (result) { // jika data ditemukan
      if (req.file) { // jika data gambar tidak kosong
        let oldFileName = result.gambar; // mengambil nama file lama
        let dir = path.join(__dirname, "../public/image/", oldFileName); // mengambil lokasi file lama
        fs.unlink(dir, (err) => err); // menghapus file lama
        data.gambar = req.file.filename; // mengubah nama file gambar
      }
      menu
        .update(data, { where: param }) // mengubah data menu berdasarkan id menu yang dikirimkan melalui parameter
        .then((result) => { // jika berhasil
          res.status(200).json({
            status: "success",
            message: "data berhasil diubah",
            data: {
              id_menu: param.id_menu,
              nama_menu: data.nama_menu,
              harga: data.harga,
              deskripsi: data.deskripsi,
              gambar: data.gambar,
              jenis: data.jenis,
            },
          });
        })
        .catch((error) => { // jika gagal
          res.status(400).json({
            status: "error",
            message: error.message,
          });
        });
    } else { // jika data tidak ditemukan
      res.status(404).json({
        status: "error",
        message: "data tidak ditemukan",
      });
    }
  });
});

// mencari menu
app.get("/search/:nama_menu", auth, async (req, res) => {
  menu 
    .findAll({ // query untuk mencari data menu berdasarkan nama menu
      where: { 
        [Op.or]: [ // query untuk mencari data menu berdasarkan nama menu
          { nama_menu: { [Op.like]: "%" + req.params.nama_menu + "%" } },
        ],
      },
    })
    .then((result) => {
      if (result.length > 0) { // jika data menu ditemukan
        res.status(200).json({
          status: "success",
          message: "menu berhasil ditemukan",
          data: result,
        });
      } else { // jika data menu tidak ditemukan
        res.status(400).json({
          status: "error",
          message: "menu not found",
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
