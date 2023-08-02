//import library
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // import library bcrypt untuk enkripsi password
const { Op } = require("sequelize");
const auth = require("../auth");
const jwt = require("jsonwebtoken"); //import library jwt
const SECRET_KEY = "UKK_Cafe_Kasir";

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const model = require("../models/index"); 
const user = model.user;

// get all data user
app.get("/getAllData", async (req, res) => {
  await user
  .findAll({
    order: [["id_user", "DESC"]],
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

// get data by id user
app.get("/getById/:id", async (req, res) => {
  await user
    .findByPk(req.params.id) // mengambil data user berdasarkan id user yang dikirimkan melalui parameter
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

// get data by role
app.get("/getByRole/:role", async (req, res) => {
  await user
    .findAll({ where: { role: req.params.role } }) // mengambil data user berdasarkan role yang dikirimkan melalui parameter
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

// register
app.post("/register", async (req, res) => {
  const data = {
    nama_user: req.body.nama_user,
    role: req.body.role,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    resultArr: {},
  };
  await user
    .findAll({
      where: { // query untuk mencari data user berdasarkan nama_user
        [Op.or]: [{ username: data.username }],
      },
    })
    .then((result) => { // jika berhasil
      resultArr = result; // menyimpan data user yang ditemukan ke dalam variabel resultArr
      if (resultArr.length > 0) { // jika data user ditemukan
        res.status(400).json({
          status: "error",
          message: "username sudah terdaftar",
        });
      } else { // jika data user tidak ditemukan
        user
          .create(data)
          .then((result) => { // jika berhasil
            res.status(200).json({
              status: "success",
              message: "user has been registered",
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

// login
app.post("/login", async (req, res) => {
  const data = await user.findOne({ where: { username: req.body.username } }); // mengambil data user berdasarkan username yang dikirimkan melalui body request

  if (data) { // jika data user ditemukan
    const validPassword = await bcrypt.compare( // membandingkan password yang dikirimkan melalui body request dengan password yang ada di database
      req.body.password,
      data.password
    );
    if (validPassword) {
      let payload = JSON.stringify(data); // generate payload
      // generate token
      let token = jwt.sign(payload, SECRET_KEY); // generate token dengan payload dan secret key
      res.status(200).json({
        status: "success",
        logged: true,
        message: "password benar",
        token: token,
        data: data,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "password salah",
      });
    }
  } else {
    res.status(400).json({
      status: "error",
      message: "user tidak ditemukan",
    });
  }
});

// delete user
app.delete("/delete/:id_user", async (req, res) => {
  const param = { id_user: req.params.id_user };
  // delete data
  user
    .destroy({ where: param })
    .then((result) => { // jika berhasil
      res.json({
        status: "success",
        message: "user has been deleted",
        data: param,
      });
    })
    .catch((error) => { // jika gagal
      res.json({
        status: "error",
        message: error.message,
      });
    });
});

// edit user
app.patch("/edit/:id_user", async (req, res) => {
  const param = { id_user: req.params.id_user };
  const data = {
   nama_user: req.body.nama_user,
   role: req.body.role,
   username: req.body.username,
   password: req.body.password,
   resultArr: {},
 };

  // cek password
  if (data.password) { // jika password dikirimkan melalui body request
    const salt = await bcrypt.genSalt(10); // generate salt
    data.password = await bcrypt.hash(data.password, salt); // generate password hash
  }

  if (data.username) { // jika username dikirimkan melalui body request
    user
      .findAll({
        where: { // query untuk mencari data user berdasarkan username
          [Op.or]: [{ username: data.username }],
        },
      })
      .then((result) => { // jika berhasil
        resultArr = result; // menyimpan data user yang ditemukan ke dalam variabel resultArr
        console.log(resultArr)
        if (resultArr.length > 0) { // jika data user ditemukan
          res.status(400).json({
            status: "error",
            message: "username sudah terdaftar",
          });
        }
      });
  }
  user
    .update(data, { where: param })
    .then((result) => { // jika berhasil
      res.status(200).json({
        status: "success",
        message: "user has been updated",
        data: {
          id_user: param.id_user,
          nama_user: data.nama_user,
          username: data.username,
          role: data.role,
        },
      });
    })
    .catch((error) => { // jika gagal
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

// search user
app.get("/search/:nama_user", async (req, res) => {
  user 
    .findAll({
      where: { 
        [Op.or]: [ // query untuk mencari data user berdasarkan nama user
          { nama_user: { [Op.like]: "%" + req.params.nama_user + "%" } },
        ],
      },
    })
    .then((result) => {
      if (result.length > 0) { // jika data user ditemukan
        res.status(200).json({
          status: "success",
          message: "user berhasil ditemukan",
          data: result,
        });
      } else { // jika data user tidak ditemukan
        res.status(400).json({
          status: "error",
          message: "user not found",
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
