// import library yang dibutuhkan
import { useDisclosure, IconButton } from "@chakra-ui/react";
import { CreditCard } from "react-feather";
import ModalBayar from "../ModalBayar";

// buat komponen Delete
export default function Bayar({ payload, reload }) {
  // buat state untuk menampilkan modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {/* set payload dan onClose ke komponen ModalDelete */}
      <ModalBayar
        isOpen={isOpen}
        onClose={onClose}
        payload={payload}
        reload={reload}
      />
      {/* set onOpen ke komponen IconButton */}
      {payload.status === "belum_bayar"?(
      <IconButton
        /* onClick={payload.status !== 'lunas' ? onOpen : null} */
        onClick={onOpen}
        aria-label="delete"
        icon={<CreditCard />}
        colorScheme="green"
      />
      ):(null)
    }
    </>
  );
}
