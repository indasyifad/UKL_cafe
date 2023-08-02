import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    Center,
    Image,
  } from "@chakra-ui/react";
  import {updateBayar } from "./ApiHandler";
  import ImageBayar from "../.../../../../../assets/image-bayar.jpg";
  
  // buat komponen ModalBayar
  export default function ModalBayar({ isOpen, onClose, payload, reload }) {
    return (
      <Modal
        size={{ base: "xs", md: "sm" }}
        isOpen={isOpen}
        onClose={onClose}
        blockScrollOnMount={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius="3xl" py={8}>
          <ModalBody alignItems="center" textAlign="center">
            <Center>
              <Image
                src={ImageBayar}
                alt={"image bayar"}
                w={["80%", "70%", "60%"]}
              />
            </Center>
            <Text fontFamily={"Poppins"} as="h3" fontSize={"lg"} fontWeight={600}>
              Pembayaran
            </Text>
            <Text fontFamily={"Poppins"} as="h6" fontSize={"xs"} fontWeight={400}>
              Apakah anda yakin ingin melakukan pembayaran secara LUNAS?
            </Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              variant={"outline"}
              colorScheme={"red"}
              size={"md"}
              mr={3}
              // ketika tombol batal diklik, panggil fungsi onClose
              onClick={onClose}
              borderRadius="lg"
              fontWeight={500}
            >
              Batal
            </Button>
            <Button
              size={"md"}
              borderRadius="lg"
              colorScheme={"red"}
              fontWeight={500}
              // ketika tombol bayar diklik, panggil fungsi updateBayar
              onClick={async () => {
                await updateBayar(payload.id_transaksi, {status:"kosong"});
                await reload();
                onClose();
              }}
            >
              Bayar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  