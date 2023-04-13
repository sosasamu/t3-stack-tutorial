import { Box, Container } from "@mui/material";

import { type NextPage } from "next";
import Head from "next/head";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container
          maxWidth="md"
          sx={{
            height: "100vh",
          }}
        >
          <Box
            sx={{
              border: 1,
              borderColor: "rgb(148 163 184)",
              height: "100%",
            }}
          >
            Single Post
          </Box>
        </Container>
      </main>
    </>
  );
};

export default SinglePostPage;