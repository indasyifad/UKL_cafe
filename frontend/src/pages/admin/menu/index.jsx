import React, { useState, useEffect } from "react";
import { Box, Flex, Progress, useDisclosure, Select, Text} from "@chakra-ui/react";
import { Input } from "antd";
const { Search } = Input;
import Heading from "../../../components/text/Heading";
import Container from "../../../components/container/Container";
import Table from "../../../components/table";
import { columns } from "./fragments/dataTable";
import ButtonAdd from "../../../components/button/ButtonAdd";
import ModalAdd from "./fragments/ModalAdd";
import { getAllMenu, getMenuByJenis} from "./fragments/ApiHandler";
import { getLocalStorage, clearLocalStorage } from "../../../utils/helper/localStorage";
import { LOCAL_STORAGE_USER } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";

export default function index() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [data, setData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure(); // buat state untuk modal
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [dataMenu, setDataMenu] = useState([]);
  
  // fungsi untuk mencari menu
  const handleSearch = async (value) => {
    setLoading(true);
    // melakukan filter pada data menu
    const res = data.filter((item) =>
      // jika nama menu mengandung value, maka tampilkan
      item.jenis.toLowerCase().includes(value)
    );
    // menyimpan data menu yang sudah difilter ke dalam state dataSearch
    setDataSearch(res);
    setLoading(false);
  };

    // fungsi untuk mengambil data menu berdasarkan jenis
    const getDataByJenis = async (jenis) => {
      setLoading(true);
      const res = await getMenuByJenis(jenis);
      setDataMenu(res.data);
      setLoading(false);
    };

  // fungsi untuk mengambil data menu
  const getData = async () => {
    setLoading(true);
    const res = await getAllMenu();
    setData(res.data);
    setLoading(false);
  };


  // ambil data menu ketika komponen pertama kali di render
  useEffect(() => {
    getData();
    // getDataByJenis();
    
    // ambil data user dari local storage
    const user = getLocalStorage(LOCAL_STORAGE_USER);
    // set state user
    setUser(user);
    if(user){
      if(user.role !== "admin"){
        navigate("/login");
        clearLocalStorage();
      }
    }
  }, []);

  return (
    <Container>
      <ModalAdd isOpen={isOpen} onClose={onClose} reload={getData} />
      <Heading text="Kelola Menu" />
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        my={5}
        gap={5}
        flexDir={{ base: "column", md: "row" }}
      >
        {/* memanggil komponen button add */}
        <ButtonAdd heading={"Tambah Menu"} onclick={onOpen} />
        <Box w={{ base: "full", md: "auto" }}>
          <Search
            placeholder="Cari Nama Menu"
            onChange={(e) => {
              // jika input kosong, maka panggil fungsi getData
              if (e.target.value === "") {
                setSearch(false);
                getData();
              }
              // jika input tidak kosong, maka panggil fungsi handleSearch
              else {
                setSearch(true);
                handleSearch(e.target.value);
              }
            }}
            style={{ width: "100%" }}
            allowClear={true}
          />
        </Box>
      </Flex>
      <Box my={10} maxW={"100%"}>
        {/*  jika loading true, maka tampilkan progress bar, jika loading false maka tampilkan table */}
        {loading ? (
          <Progress size="xs" isIndeterminate />
        ) : (
          <Box w={"100%"}>
            <Table
              columns={columns}
              data={
                search
                  ? dataSearch?.map((item, index) => {
                      return {
                        ...item,
                        reload: getData,
                        key: index,
                      };
                    })
                  : data?.map((item, index) => {
                      return {
                        ...item,
                        reload: getData,
                        key: index,
                      };
                    })
              }
              pagination={{
                position: ["bottomRight"],
                defaultPageSize: 3,
                showSizeChanger: true,
                pageSizeOptions: ["3", "5", "10"],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} dari ${total} items`,
              }}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}
