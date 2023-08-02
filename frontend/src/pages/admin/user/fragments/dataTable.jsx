import React from "react";
import ActionButton from "./ActionButton";
import { Badge } from '@chakra-ui/react'

const columns = [
  {
    title: "Nama",
    dataIndex: "nama_user",
    key: "nama_user",
    width: "15%",
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
    width: "15%",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    width: "15%",
    render: (data) => <Badge colorScheme={data === 'admin' ? 'green' : data === 'kasir' ? 'purple' : data === 'manajer' ? 'red' : null}>{data}</Badge>,
  },
  {
    title: "Aksi",
    key: "aksi",
    width: "15%",
    render: (data) => (
      <ActionButton payload={data.id_user} reload={data.reload} />
    ),
  },
];

export { columns };
