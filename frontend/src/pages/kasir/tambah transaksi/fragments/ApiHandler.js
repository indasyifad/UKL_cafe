import axios from "axios";
import { BASE_API } from "../../../../utils/constants";
import { getLocalStorage } from "../../../../utils/helper/localStorage";
import { LOCAL_STORAGE_TOKEN } from "../../../../utils/constants";

// fungsi untuk mengambil semua data menu
export const getAllMenu = async () => {
  const URL = `${BASE_API}/menu/getAllData`;
  // melakukan request ke server
  try {
    const data = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    const res = data.data;

    // jika status response adalah success
    if (res.status === "success") {
      // mengembalikan data menu
      return Promise.resolve({
        status: "success",
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

// fungsi untuk mengunggah data detail transaksi
export const addDetailTransaksi = async (values) => {
  const URL = `${BASE_API}/detail_transaksi/create`;
  // melakukan request ke server
  try {
    const data = await axios.post(URL, values, {
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    const res = data.data;

    // jika status response adalah success
    if (res.status === "success") {
      return Promise.resolve({
        status: "success",
        message: "Berhasil menambahkan detail transaksi",
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
