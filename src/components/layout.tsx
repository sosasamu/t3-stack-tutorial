import { Box, Container } from "@mui/material";
import type { PropsWithChildren } from "react";

export const LayoutPage = (props: PropsWithChildren) => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          height: "100%",
        }}
      >
        {props.children}
      </Box>
    </Container>
  );
};
