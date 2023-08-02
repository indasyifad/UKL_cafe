import axios from "axios";
import { BASE_API } from "../../../../utils/constants";
import { getLocalStorage } from "../../../../utils/helper/localStorage";
import { LOCAL_STORAGE_TOKEN } from "../../../../utils/constants";

// fungsi untuk mengambil semua data Meja
export const getAllMeja = async () => {
  const URL = `${BASE_API}/meja/getAllData`;
  try {
    // melakukan request ke server
    const data = await axios.get(URL, {
      // menambahkan header Authorization
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    // mengambil data dari response
    const res = data.data;

    // jika status response adalah success
    if (res.status === "success") {
      return Promise.resolve({
        status: "success",
        data: res.data,
      });
    }
  } catch (err) {
    // jika terjadi error
    return Promise.resolve({
      status: "error",
      message: err.response.data.message,
    });
  }
};

// fungsi untuk mengambil data meja berdasarkan id
export const getMejaById = async (id) => {
  const URL = `${BASE_API}/meja/getById/${id}`;
  try {
    // melakukan request ke server
    const data = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    // mengambil data dari response
    const res = data.data;

    // jika status response adalah success
    if (res.status === "success") {
      return Promise.resolve({
        status: "success",
        data: res.data,
      });
    }
  } catch (err) {
    // jika terjadi error
    return Promise.resolve({
      status: "error",
      message: err.response.data.message,
    });
  }
};

// fungsi untuk mengambil data Meja berdasarkan nama
export const searchMeja = async (value) => {
  const URL = `${BASE_API}/meja/search/${value}`;
  try {
    const data = await axios.get(URL, {
      // menambahkan header Authorization
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    // mengambil data dari response
    const res = data.data;

    // jika status response adalah success
    if (res.status === "success") {
      return Promise.resolve({
        status: "success",
        data: res.data,
      });
    }
  } catch (err) {
    // jika terjadi error
    return Promise.resolve({
      status: "error",
      message: err.response.data.message,
    });
  }
};

// fungsi untuk input data Meja
export const addMeja = async (values) => {
  const URL = `${BASE_API}/meja/create`;
  try {
    const data = await axios.post(URL, values, {
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    // mengambil data dari response
    const res = data.data;

    // jika status response adalah success
    if (res.status === "success") {
      return Promise.resolve({
        status: "success",
        message: "Berhasil menambahkan meja",
        data: res.data,
      });
    }
  } catch (err) {
    // jika terjadi error
    return Promise.resolve({
      status: "error",
      message: err.response,
    });
  }
};

// fungsi untuk update data meja berdasarkan id
export const updateMeja = async ({ values, id }) => {
  const URL = `${BASE_API}/meja/edit/${id}`;
  try {
    // melakukan request ke server
    const data = await axios.patch(URL, values, {
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    // mengambil data dari response
    const res = data.data;

    // jika status response adalah success
    if (res.status === "success") {
      return Promise.resolve({
        status: "success",
        message: "Berhasil mengubah meja",
        data: res.data,
      });
    }
  } catch (err) {
    // jika terjadi error
    return Promise.resolve({
      status: "error",
      message: err.response.data.message,
    });
  }
};

// fungsi untuk menghapus data meja berdasarkan id
export const deleteMeja = async (id) => {
  const URL = `${BASE_API}/meja/delete/${id}`;
  try {
    // melakukan request ke server
    const data = await axios.delete(URL, {
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    // mengambil data dari response
    const res = data.data;

    // jika status response adalah success
    if (res.status === "success") {
      return Promise.resolve({
        status: "success",
        message: "Berhasil menghapus meja",
        data: res.data.id_user,
      });
    }
  } catch (err) {
    // jika terjadi error
    return Promise.resolve({
      status: "error",
      message: err.response.data.message,
    });
  }
};
