import React, { useState, useEffect } from "react";
import { Text, Box } from "@chakra-ui/react";
import HeadingDashboard from "../../../components/text/HeadingDashboard";

import { getLocalStorage, clearLocalStorage  } from "../../../utils/helper/localStorage";
import { LOCAL_STORAGE_USER } from "../../../utils/constants";
import ImageLogin1 from "../../../assets/image-login1.jpg";
import { Center, Container, Grid, GridItem, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function index() {
  // buat state user
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ambil data user dari local storage
    const user = getLocalStorage(LOCAL_STORAGE_USER);
    setUser(user);
    if(user){
      if(user.role !== "kasir"){
        navigate("/login");
        clearLocalStorage();
      }
    }
  }, []);

  return (
    <Container>
      <Box
        textAlign={"center"}
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        gap={5}
        w={"full"}
        position={"absolute"}
        top={"50%"}
        left={"50%"}
        transform={"translate(-40%, -50%)"}
        w={{ base: "90%", md: "90%", xl: "80%" }}
      >
        <Grid
          gap={{ base: "5", lg: "50" }}
          h="100vh"
          w="base: 100%"
          templateColumns={{ lg: "repeat(2, 1fr)" }}
          justifyContent="center"
        >
          <GridItem margin={{ base: "auto", lg: "auto 0" }}>
            {/* tampilkan komponen LoginForm */}
            <HeadingDashboard text="Selamat Datang di Dashboard Kasir" />
            <Text fontWeight={500} fontSize={"xl"}>
              Happy working {user?.nama_user} as kasir !
            </Text>
          </GridItem>
          <GridItem margin={{ base: "5", lg: "auto 0" }} w='90%' h='450'>
            <Center>
              <Image src={ImageLogin1} alt="image login" />
            </Center>
          </GridItem>
        </Grid>
        </Box>
    </Container>
  );
}
