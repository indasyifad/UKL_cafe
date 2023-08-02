import React from "react";
import { Center, Container, Grid, GridItem, Image } from "@chakra-ui/react";
import LoginForm from "./fragments/LoginForm";
import ImageLogin5 from "../../assets/image-login5.png";

export default function index() {
  return (
    <Container maxW="100%" gridTemplateRows="repeat(2, 1fr)" py={14} p={0}>
      <Center>
        <Grid
          gap={{ base: "5", lg: "50" }}
          h="100vh"
          w="base: 100%"
          templateColumns={{ lg: "repeat(2, 1fr)" }}
          justifyContent="center"
        >
          <GridItem margin={{ base: "5", lg: "auto 0", w: "100%" }}>
            <Center>
              {/* tampilkan gambar login */}
              <Image src={ImageLogin5} alt="image login" style={{ width: '100%', height: '100vh', objectFit: 'cover' }}/>
            </Center>
          </GridItem>
          <GridItem margin={{ base: "auto", lg: "auto 0" }}>
            {/* tampilkan komponen LoginForm */}
            <LoginForm />
          </GridItem>
        </Grid>
      </Center>
    </Container>
  );
}
