// Desc: Halaman Detail Transaksi
// import library yang dibutuhkan
import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  Input,
  Flex,
  Grid,
  GridItem,
  Select,
  Button,
  Box,
} from "@chakra-ui/react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Heading from "../../../components/text/Heading";
import Container from "../../../components/container/Container";
import {
  getTransaksiById,
  getDetailTransaksiByIdTransaksi,
} from "./fragments/ApiHandler";
import {
  updateTransaksi,
  updateStatusMeja,
} from "../transaksi/fragments/ApiHandler";
import AlertNotification from "../../../components/alert";
import { jsPDF } from "jspdf";
import { IconButton } from "@chakra-ui/react";
import { Printer } from "react-feather";

// buat komponen index
export default function index() {
  // deklarasi variabel
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [kolomMenu, setKolomMenu] = useState([]);
  const pdfRef = useRef(null); // untuk membuat ref pada komponen

  // fungsi untuk mengambil data transaksi berdasarkan id
  const getTransaksi = async () => {
    const res = await getTransaksiById(id);
    const resDetailTransaksi = await getDetailTransaksiByIdTransaksi(id);
    setTransaksi(res.data);
    setKolomMenu(resDetailTransaksi.data);
  };

  // fungsi untuk handle submit transaksi
  const submitHandlerTransaksi = async (values) => {
    // set loading menjadi true
    setLoading(true);
    const value = {
      nama_pelanggan: values.nama_pelanggan,
      status: values.status,
      id_meja: transaksi.meja.id_meja,
    };

    // panggil fungsi addTransaksi
    const res = await updateTransaksi(id, value);
    await updateStatusMeja(transaksi.meja.id_meja, {
      status: values.status_meja,
    });
    // set message dan status dari respon
    setMessage(res.message);
    setStatus(res.status);

    // // jika status respon adalah success
    if (res.status === "success") {
      // set loading menjadi false dan reset form setelah 500ms
      setTimeout(() => {
        reset(),
          setStatus(""),
          setMessage(""),
          getTransaksi(),
          setLoading(false);
      }, 500);
      return;
    }
    // jika status respon bukan success
    else {
      // set loading menjadi false dan reset form setelah 1000ms
      setTimeout(() => {
        setLoading(false), setMessage(""), setStatus("");
      }, 1000);
    }
  };

  // fungsi untuk memasukan data ke dalam form
  useEffect(() => {
    if (transaksi) {
      const tgl_transaksi = new Date(
        transaksi?.tgl_transaksi
      ).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }); // mengubah format tanggal menjadi tanggal lokal indonesia
      reset({
        tgl_transaksi: tgl_transaksi,
        id_meja: transaksi?.meja?.nomor_meja,
        nama_pelanggan: transaksi?.nama_pelanggan,
        status: transaksi?.status,
        status_meja: transaksi?.meja?.status,
      });
    }
  }, [transaksi]);

  // ambil data menu ketika komponen pertama kali di render
  useEffect(() => {
    getTransaksi();
  }, []);

  return (
    <Container>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        my={10}
        gap={5}
        flexDir={{ base: "column", md: "row" }}
      >
      <Box w={{ md: "40%", lg: "30%", xl: "20%" }}   display="flex" justifyContent="space-between">
          <Link to={`/dashboard/kasir/transaksi`}>
            <Button
              colorScheme={"blue"}
              w={"100%"}
              mt={2}
              isLoading={loading}
            >
              Kembali
            </Button>
          </Link>
          
          <Link to={`/dashboard/kasir/transaksi/${id}/cetak`} style={{marginLeft: '400%'}}>
             <IconButton
              aria-label="print"
              icon={<Printer />}
              colorScheme="green"
              w={"30%"}
                    mt={2}
                    isLoading={loading}
            />
          </Link>
        </Box>  
      </Flex>
      <Heading text="Detail Transaksi" /> {/* memanggil komponen heading */}
      {/* menampilkan alert notifikasi */}
      <AlertNotification status={status} message={message} />
      <Box>
        <Grid
          templateColumns={{ md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={10}
          my={6}
        >
          <GridItem>
            <Flex direction="column">
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Tanggal Transaksi
              </Text>
              <Input
                name="tgl_transaksi"
                id="tgl_transaksi"
                borderRadius="lg"
                focusBorderColor="messenger.500"
                placeholder="Tanggal Transaksi"
                {...register("tgl_transaksi")}
                isReadOnly
              />
            </Flex>
            {/* <Flex direction="column" my={4}>
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Status Pembayaran
              </Text>
              <Select
                name="status"
                id="status"
                borderRadius="lg"
                focusBorderColor="green.600"
                placeholder="Status Pembayaran"
                {...register("status", {
                  required: true,
                })}
              >
                <option value="belum_bayar">Belum Bayar</option>
                <option value="lunas">Lunas</option>
              </Select> */}
              {/* jika error type nya required, maka tampilkan pesan error */}
              {/* {errors.status?.type === "required" && (
                <FormHelperText textColor="red" mb={4}>
                  Masukkan Status
                </FormHelperText>
              )}
            </Flex> */}
          </GridItem>
          <GridItem>
            <Flex direction="column">
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Nomor Meja
              </Text>
              <Input
                name="id_meja"
                id="id_meja"
                borderRadius="lg"
                focusBorderColor="messenger.500"
                placeholder="Nomor Meja"
                {...register("id_meja")}
                isReadOnly
              />
            </Flex>
            {/* <Flex direction="column" my={4}>
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Status Meja
              </Text>
              <Select
                name="status_meja"
                id="status_meja"
                borderRadius="lg"
                focusBorderColor="green.600"
                placeholder="Status Meja"
                {...register("status_meja", {
                  required: true,
                })}
              >
                <option value="terisi">Terisi</option>
                <option value="kosong">Kosong</option>
              </Select> */}
              {/* jika error type nya required, maka tampilkan pesan error */}
             {/*  {errors.status_meja?.type === "required" && (
                <FormHelperText textColor="red" mb={4}>
                  Masukkan Status Meja
                </FormHelperText>
              )}
            </Flex> */}
          </GridItem>
          <GridItem>
            <Flex direction="column">
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Nama Pelanggan
              </Text>
              <Input
                name="nama_pelanggan"
                id="nama_pelanggan"
                borderRadius="lg"
                focusBorderColor="messenger.500"
                placeholder="Nama Pelanggan"
                {...register("nama_pelanggan", {
                  required: true,
                })}
              />
              {/* jika error type nya required, maka tampilkan pesan error */}
              {errors.nama_pelanggan?.type === "required" && (
                <FormHelperText textColor="red" mb={4}>
                  Masukkan Nama Pelanggan
                </FormHelperText>
              )}
            </Flex>
          </GridItem>
        </Grid>
        <Heading text="Detail Pemesanan" /> {/* memanggil komponen heading */}
        <Flex flexDir={"column"}>
          {kolomMenu.map((row, indexRow) => (
            <Flex
              w={"full"}
              gap={10}
              my={6}
              alignItems={"flex-end"}
              key={indexRow}
            >
              <Flex direction="column">
                <Text fontSize={"sm"} fontFamily={"Poppins"}>
                  Nama Menu
                </Text>
                <Input readOnly value={row.menu.nama_menu} />
              </Flex>
              <Flex direction="column">
                <Text fontSize={"sm"} fontFamily={"Poppins"}>
                  Harga
                </Text>
                <Input readOnly value={row.menu.harga} />
              </Flex>
              <Flex direction="column">
                <Text fontSize={"sm"} fontFamily={"Poppins"}>
                  Jumlah
                </Text>
                <Flex alignItems={"center"} gap={3}>
                  <Text fontSize={"md"}>
                    <Input readOnly value={row.jumlah} />
                  </Text>
                </Flex>
              </Flex>
              <Flex direction="column">
                <Text fontSize={"sm"} fontFamily={"Poppins"}>
                  Total Harga
                </Text>
                <Input readOnly value={row.harga} />
              </Flex>
            </Flex>
          ))}
          {/* jika kolom menu lebih dari 0, maka tampilkan total harga */}
          {kolomMenu.length > 0 && (
            <Text fontSize={"md"} mb={2} fontFamily={"Poppins"}>
              Total Harga : Rp.
              {/* 
            menampilkan total harga dengan menggunakan fungsi reduce
            reduce adalah fungsi yang digunakan untuk mengurangi array menjadi satu nilai
            reduce akan menghitung total harga dari semua menu yang ada
          */}
              {kolomMenu.reduce((total, item) => {
                // total adalah nilai awal, item adalah nilai yang akan dihitung
                return total + item.harga;
              }, 0)}
            </Text>
          )}
        </Flex>
      </Box>
    </Container>
  );
}
