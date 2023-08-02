import React from "react";
import { Badge } from '@chakra-ui/react'

const columns = [
  {
    title: "Nama Pelanggan",
    width: "15%",
    dataIndex: "transaksi",
    key: "transaksi",
    render: (data) => <span>{data?.nama_pelanggan}</span>,
  },
  {
    title: "Status",
    dataIndex: "transaksi",
    key: "transaksi",
    width: "15%",
    render: (data) => {
      if (data?.status === "lunas") {
        return <span><Badge color="green">LUNAS</Badge></span>;
      } else {
        return <span><Badge color="red">BELUM LUNAS</Badge></span>;
      }
    }
  },
  {
    title: "Tanggal Transaksi",
    dataIndex: "transaksi",
    key: "transaksi",
    width: "15%",
    render: (data) => (
      <span>
        {new Date(data?.tgl_transaksi).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    title: "Pendapatan",
    dataIndex: "pendapatan",
    key: "pendapatan",
    width: "15%",
  },
];

export { columns };
