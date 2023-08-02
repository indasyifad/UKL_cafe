import React from "react";
import ActionButton from "./ActionButton";
import { Badge } from '@chakra-ui/react'

const columns = [
  {
    title: "Nama Pelanggan",
    dataIndex: "nama_pelanggan",
    key: "nama_pelanggan",
    width: "15%",
  },
  {
    title: "Nomor Meja",
    dataIndex: "meja",
    key: "nomor_meja",
    width: "15%",
    render: (data) => <span>{data?.nomor_meja}</span>,
  },
  {
    title: "Tanggal Transaksi",
    dataIndex: "tgl_transaksi",
    key: "tgl_transaksi",
    width: "15%",
    render: (data) => <span>{
      new Date(data).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }</span>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "15%",
    render: (data) => <Badge colorScheme={data === 'lunas' ? 'green' : 'red'}>{data === 'lunas' ? 'LUNAS' : 'BELUM LUNAS'}</Badge>,
  },
  {
    title: "Aksi",
    key: "aksi",
    width: "15%",
    render: (data) => (
      <ActionButton payload={data} reload={data?.reload} 
      />
    ),
  },
];

export { columns };
