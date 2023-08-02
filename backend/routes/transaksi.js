//import library
const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../auth");
const { Op } = require("sequelize");

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const model = require("../models/index");
const transaksi = model.transaksi;
const user = model.user;
const meja = model.meja;
const detail_transaksi = model.detail_transaksi;
const menu = model.menu;

// mengambil semua data transaksi
app.get("/getAllData", auth, async (req, res) => {
  await transaksi
    .findAll({
      include: [
        // join tabel user dan meja
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
      order: [["id_transaksi", "DESC"]],
    })
    .then((result) => {
      // jika berhasil
      res.status(200).json({
        status: "success",
        data: result,
      });
    })
    .catch((error) => {
      // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

// get data by id transaksi
app.get("/getById/:id", auth, async (req, res) => {
  await transaksi
    .findByPk(req.params.id, {
      include: [
        // join tabel user dan meja
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      // jika berhasil
      if (result) {
        res.status(200).json({
          status: "success",
          data: result,
        });
      } else {
        // jika data tidak ditemukan
        res.status(404).json({
          status: "error",
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => {
      // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

// get transaksi by id user
app.get("/getByIdUser/:id_user", auth, async (req, res) => {
  await transaksi
    .findAll({
      order: [["id_transaksi", "DESC"]],
      where: { id_user: req.params.id_user },
      include: [
        // join tabel user dan meja
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      // jika berhasil
      if (result) {
        res.status(200).json({
          status: "success",
          data: result,
        });
      } else {
        // jika data tidak ditemukan
        res.status(404).json({
          status: "error",
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => {
      // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

// create transaksi
app.post("/create", async (req, res) => {
  const data = {
    id_user: req.body.id_user,
    id_meja: req.body.id_meja,
    nama_pelanggan: req.body.nama_pelanggan,
    status: "belum_bayar",
  };

  await transaksi
    .create(data)
    .then((result) => {
      // jika berhasil
      res.status(200).json({
        status: "success",
        message: "transaksi berhasil ditambahkan",
        data: result,
      });

      // update status meja
      meja.update(
        { status: "terisi" },
        { where: { id_meja: req.body.id_meja } }
      ); // mengubah status meja menjadi dipesan
    })
    .catch((error) => {
      // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

// delete transaksi
app.delete("/delete/:id_transaksi", auth, async (req, res) => {
  const param = { id_transaksi: req.params.id_transaksi };

  transaksi
    .destroy({ where: param })
    .then((result) => {
      if (result) {
        // jika data ditemukan
        res.status(200).json({
          status: "success",
          message: "transaksi berhasil dihapus",
          data: param,
        });
      } else {
        // jika data tidak ditemukan
        res.status(404).json({
          status: "error",
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => {
      // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

// edit transaksi
app.patch("/edit/:id_transaksi", auth, async (req, res) => {
  const param = { id_transaksi: req.params.id_transaksi };
  const data = {
    id_user: req.body.id_user,
    id_meja: req.body.id_meja,
    nama_pelanggan: req.body.nama_pelanggan,
    status: req.body.status,
  };

  transaksi.findOne({ where: param }).then((result) => {
    if (result) {
      // jika data ditemukan
      transaksi
        .update(data, { where: param })
        .then((result) => {
          // jika berhasil
          res.status(200).json({
            status: "success",
            message: "data berhasil diubah",
            data: {
              id_transaksi: param.id_transaksi,
              ...data,
            },
          });
          // update status meja
          if (req.body.status === "lunas") {
            meja.update(
              { status: "kosong" },
              { where: { id_meja: req.body.id_meja } }
            );
          }
        })
        .catch((error) => {
          // jika gagal
          res.status(400).json({
            status: "error",
            message: error.message,
          });
        });
    } else {
      // jika data tidak ditemukan
      res.status(404).json({
        status: "error",
        message: "data tidak ditemukan",
      });
    }
  });
});

// filtering transaksi berdasarkan tgl_transaksi
app.get("/filter/tgl_transaksi/:tgl_transaksi", auth, async (req, res) => {
  const param = { tgl_transaksi: req.params.tgl_transaksi };

  transaksi
    .findAll({
      where: {
        tgl_transaksi: {
          [Op.between]: [
            param.tgl_transaksi + " 00:00:00",
            param.tgl_transaksi + " 23:59:59",
          ], // mencari data transaksi berdasarkan tanggal transaksi yang dikirimkan melalui parameter
        },
      },
      include: [
        // join tabel user dan meja
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      if (result.length === 0) {
        // jika data tidak ditemukan
        res.status(404).json({
          status: "error",
          message: "data tidak ditemukan",
        });
      } else {
        // jika data ditemukan
        res.status(200).json({
          status: "success",
          message: "data ditemukan",
          data: result,
        });
      }
    })
    .catch((error) => {
      // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

// filtering transaksi berdasarkan nama_user dari tabel user
app.get("/filter/nama_user/:nama_user", auth, async (req, res) => {
  const param = { nama_user: req.params.nama_user };

  user
    .findAll({
      // mengambil data user berdasarkan nama user yang dikirimkan melalui parameter
      where: {
        nama_user: param.nama_user,
      },
    })
    .then((result) => {
      if (result == null) {
        // jika data tidak ditemukan
        res.status(404).json({
          status: "error",
          message: "data tidak ditemukan",
        });
      } else {
        // jika data ditemukan
        transaksi
          .findAll({
            // mengambil data transaksi berdasarkan id user yang dikirimkan melalui parameter
            where: {
              id_user: result[0].id_user,
            },
          })
          .then((result) => {
            if (result.length === 0) {
              // jika data tidak ditemukan
              res.status(404).json({
                status: "error",
                message: "data tidak ditemukan",
              });
            } else {
              // jika data ditemukan
              res.status(200).json({
                status: "success",
                message: "data ditemukan",
                data: result,
              });
            }
          })
          .catch((error) => {
            // jika gagal
            res.status(400).json({
              status: "error",
              message: error.message,
            });
          });
      }
    })
   /*  .catch((error) => { (coment))
      // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }); */
});

// filtering transaksi berdasarkan bulan transaksi dari tgl_transaksi
app.get("/filter/bulan_transaksi/:bulan_transaksi", auth, async (req, res) => {
  const params = { bulan_transaksi: req.params.bulan_transaksi };

  transaksi
    .findAll({
      // mengambil data transaksi berdasarkan bulan transaksi yang dikirimkan melalui parameter
      where: {
        tgl_transaksi: {
          // mengambil 2 digit pertama dari bulan transaksi yang dikirimkan melalui parameter
          [Op.like]: params.bulan_transaksi + "%",
        },
      },
      include: [
        // join tabel user dan meja
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      if (result.length === 0) {
        // jika data tidak ditemukan
        res.status(404).json({
          status: "error",
          message: "data tidak ditemukan",
        });
      } else {
        // jika data ditemukan
        res.status(200).json({
          status: "success",
          message: "data ditemukan",
          data: result,
        });
      }
    })
    .catch((error) => {
      // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

// bayar transaksi
app.put("/bayar/:id_transaksi", async (req, res) => {
  const param = { id_transaksi: req.params.id_transaksi };
  console.log(param)
  
  transaksi
    .update({ status: `lunas` }, { where: param })
    .then(async (result) => {
      let dataTransaksi = await transaksi.findOne({
        where: { id_transaksi: req.params.id_transaksi },
      });

      let idMeja = dataTransaksi.id_meja
      await meja.update(
        { status: "kosong" },
        { where: { id_meja: idMeja} }
      ); 
      res.status(200).json({
        status: "success",
        message: "data berhasil diubah",
      }); 
    })
    .catch((error) => {
      // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

// update transaksi detail
app.put("/updatePemesanan/:id_transaksi", auth, async (req, res) => {
  const param = { id_transaksi: req.params.id_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  
  const listOrder = req.body.list_order // inisialisasi parameter yang akan dikirimkan melalui body

  // find all data detail transaksi dimana id_transaksi sesuai params
  let detail = await detail_transaksi.findAll({
    where: param,
    include: ['menu']
  }) 
  
  // ini deklarasi variabel array untuk save data
  let dataRecent = []
  let payloadUpdate = []
  let addDetail = []

  // Looping for check
  for(let i = 0; i < listOrder.length; i++){
    // check if di detail ada id menu yang sama dengan id di payload listOrder
    const find = detail.find((x) => x.dataValues.id_menu === listOrder[i].id_menu);

    // Jika ada
    if(find){
      dataRecent.push(find.dataValues) // simpan data yang ada di detail
      payloadUpdate.push(listOrder[i]) // simpan data yang ada di payload
    }else{ // Jika tidak
      addDetail.push(listOrder[i]) // simpan data payload di addDetail
    }
  }

  // LOOPING UPDATE QTY
  for(let i = 0; i < dataRecent.length; i++){
    let getMenu = await menu.findOne({ where: { id_menu: payloadUpdate[i].id_menu } })
    let payloadQty = {
      jumlah: payloadUpdate[i].jumlah,
      harga: payloadUpdate[i].jumlah * getMenu.harga
    }

    await detail_transaksi.update(payloadQty, {
      where: { id_detail_transaksi: dataRecent[i].id_detail_transaksi}
    })
  }

  // INSERT NEW DETAIL
  for(let i = 0; i < addDetail.length; i++){
    let getMenu = await menu.findOne({ where: { id_menu: addDetail[i].id_menu } })

    let detailItem = {
      id_transaksi: req.params.id_transaksi,
      id_menu: addDetail[i].id_menu,
      jumlah: addDetail[i].jumlah,
      harga: addDetail[i].jumlah * getMenu.harga
    }

    await detail_transaksi.create(detailItem)
  }

  res.status(200).json({
    status: "success",
  });
});

module.exports = app; // export module app
