// import library yang dibutuhkan
import React from "react";
import { Heading as HeadingText } from "@chakra-ui/react";

// buat komponen Heading
export default function Heading(props) {
  return (
    <HeadingText
      as="h5"
      size="lg"
      fontWeight={600}
      color={"messenger.500"}
      fontFamily={"Poppins"}
      textTransform={props.textTransform} // set text transform dari props
    >
      {/* tampilkan text dari props */}
      {props.text}
    </HeadingText>
  );
}
