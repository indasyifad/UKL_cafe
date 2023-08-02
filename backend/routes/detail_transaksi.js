//import library
const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../auth");
const { Op, fn, col, literal } = require("sequelize");

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const model = require("../models/index");
const detail_transaksi = model.detail_transaksi;
const transaksi = model.transaksi;

// mengambil semua data detail_transaksi
app.get("/getAllData", auth, async (req, res) => {
  await detail_transaksi
    .findAll()
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

// get data by id detail_transaksi
app.get("/getById/:id", auth, async (req, res) => {
  await detail_transaksi
    .findByPk(req.params.id)
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

// get data by id_transaksi
app.get("/getByIdTransaksi/:id_transaksi", auth, async (req, res) => {
  await detail_transaksi
    .findAll({
      where: { id_transaksi: req.params.id_transaksi }, // mengambil semua data detail_transaksi berdasarkan id_transaksi yang dikirimkan melalui parameter
      include: [
        {
          model: model.menu,
          as: "menu",
        },
      ],
    }) // mengambil semua data detail_transaksi
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

// create detail_transaksi
app.post("/create", async (req, res) => {
  const data = {
    id_transaksi: req.body.id_transaksi,
    id_menu: req.body.id_menu,
    harga: req.body.harga,
    jumlah: req.body.jumlah,
  };

  await detail_transaksi
    .create(data)
    .then((result) => { // jika berhasil
      res.status(200).json({
        status: "success",
        message: "detail transaksi berhasil ditambahkan",
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

// delete detail_transaksi
app.delete("/delete/:id_transaksi", auth, async (req, res) => {
  const param = { id_transaksi: req.params.id_transaksi };
  detail_transaksi
    .destroy({ where: param })
    .then((result) => {
      if (result) { // jika data ditemukan
        res.status(200).json({
          status: "success",
          message: "detail transaksi berhasil dihapus",
          data: param,
        });
        transaksi.destroy({where: param})
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

// edit detail_transaksi
app.patch("/edit/:id_detail_transaksi", auth, async (req, res) => { 
  const param = { id_detail_transaksi: req.params.id_detail_transaksi };
  const data = {
   id_transaksi: req.body.id_transaksi,
   id_menu: req.body.id_menu,
   harga: req.body.harga,
   jumlah: req.body.jumlah,
  };

  detail_transaksi.findOne({ where: param }).then((result) => { // mengambil data detail_transaksi berdasarkan id detail_transaksi yang dikirimkan melalui parameter
    if (result) { // jika data ditemukan
      detail_transaksi
        .update(data, { where: param })
        .then((result) => { // jika berhasil
          res.status(200).json({
            status: "success",
            message: "data berhasil diubah",
            data: {
              id_detail_transaksi: param.id_detail_transaksi,
              ...data,
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

// mencari menu yang paling banyak di pesan dan yang paling sedikit di pesan
app.get("/getMenu", auth, async (req, res) => {
  await detail_transaksi
    .findAll({
      attributes: [
        'id_menu',
        [fn('SUM', col('detail_transaksi.jumlah')), 'jumlah']
      ],
      include: [
        {
          model: model.menu,
          as: 'menu'
        }
      ],
      group: ['id_menu'],
      order: [[literal('jumlah'), 'DESC']]
    }) // mengambil semua data detail_transaksi
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

// mencari total pendapatan berdasarkan tanggal
app.get("/getPendapatan/:tgl_transaksi", auth, async (req, res) => {
  const param = { tgl_transaksi: req.params.tgl_transaksi };
  await detail_transaksi
    .findAll({
      order: [["id_transaksi", "DESC"]],
      // attributes diisi dengan nama kolom yang akan diambil datanya
      // attributes berfungsi untuk mengambil data dari tabel yang diinginkan
      attributes: [
        [fn('SUM', col('detail_transaksi.harga')), 'pendapatan']
      ],
      // include berfungsi untuk mengambil data dari tabel lain yang terhubung dengan tabel yang diinginkan
      include: [
        {
          model: model.transaksi,
          as: 'transaksi',
          where: {
            tgl_transaksi: {
              [Op.between]: [
                param.tgl_transaksi + " 00:00:00",
                param.tgl_transaksi + " 23:59:59",
              ], // mencari data transaksi berdasarkan tanggal transaksi
            }
          },
        }
      ],
      group: ['detail_transaksi.id_transaksi']
    }) // mengambil semua data detail_transaksi
    .then((result) => { // jika berhasil
      res.status(200).json({
        status: "success",
        data: result,
        total_keseluruhan: result.reduce((a, b) => a + parseInt(b.dataValues.pendapatan), 0) // menghitung total keseluruhan pendapatan
      });
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ 
        status: "error",
        message: error.message,
      });
    });
});

// mencari total pendapatan berdasarkan bulan
app.get("/getPendapatanBulan/:tgl_transaksi", auth, async (req, res) => {
  const param = { tgl_transaksi: req.params.tgl_transaksi };
  await detail_transaksi
    .findAll({
      order: [["id_transaksi", "DESC"]],
      // attributes diisi dengan nama kolom yang akan diambil datanya
      // attributes berfungsi untuk mengambil data dari tabel yang diinginkan
      attributes: [
        [fn('SUM', col('detail_transaksi.harga')), 'pendapatan']
      ],
      // include berfungsi untuk mengambil data dari tabel lain yang terhubung dengan tabel yang diinginkan
      include: [
        {
          model: model.transaksi,
          as: 'transaksi',
          where: literal(`MONTH(tgl_transaksi) = ${param.tgl_transaksi}`)
        }
      ],
      group: ['detail_transaksi.id_transaksi']
    }) // mengambil semua data detail_transaksi
    .then((result) => { // jika berhasil
      res.status(200).json({
        status: "success",
        data: result,
        total_keseluruhan: result.reduce((a, b) => a + parseInt(b.dataValues.pendapatan), 0) // menghitung total keseluruhan pendapatan
      });
    })
    .catch((error) => { // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

module.exports = app;