import { SignInButton, useUser } from "@clerk/nextjs";
import {
  Alert,
  Box,
  Button,
  ImageListItem,
  Snackbar,
  TextField,
} from "@mui/material";
import type { SnackbarOrigin } from "@mui/material";

import { type NextPage } from "next";

import { api } from "~/utils/api";
import Image from "next/image";

import { Loading } from "~/components/loaders/loading";
import { useState } from "react";
import { SubmitPostLoading } from "~/components/loaders/submitPostLoading";
import { PostView } from "~/components/postview";
import { LayoutPage } from "~/components/layout";

export interface State extends SnackbarOrigin {
  message: string | undefined;
  open: boolean;
}

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");
  const [snackbarState, setSnackbarState] = useState<State>({
    horizontal: "center",
    message: "",
    open: false,
    vertical: "bottom",
  });
  const { vertical, horizontal, open, message } = snackbarState;

  const handleCloseSnackBar = () => {
    setSnackbarState((state) => ({ ...state, open: false }));
  };

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        setSnackbarState((state) => ({
          ...state,
          open: true,
          message: errorMessage[0],
        }));
      } else {
        setSnackbarState((state) => ({
          ...state,
          open: true,
          message: "Failed to post! Please try again later.",
        }));
      }
    },
  });

  if (!user) return null;
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "rgb(148 163 184)",
        display: "flex",
        p: 4,
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleCloseSnackBar}
        autoHideDuration={3000}
        key={vertical + horizontal}
      >
        <Alert onClose={handleCloseSnackBar} severity="error">
          {message}
        </Alert>
      </Snackbar>
      <ImageListItem sx={{ height: 56, width: 56 }}>
        <Image
          src={user?.profileImageUrl}
          alt="profileImage"
          style={{ borderRadius: "50%" }}
          width={56}
          height={56}
        />
      </ImageListItem>
      <TextField
        sx={{
          flexGrow: 1,
          input: { color: "white" },
          label: { color: "white" },
          marginLeft: 2,
          marginRight: 2,
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (input !== "" && !isPosting) {
              mutate({ content: input });
            }
          }
        }}
        label="Type some emojis!"
        variant="standard"
        color="primary"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <Button
          disabled={isPosting}
          onClick={() => mutate({ content: input })}
          variant="outlined"
        >
          Post
        </Button>
      )}
      {isPosting && <SubmitPostLoading />}
    </Box>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <Loading />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </Box>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <LayoutPage>
      <Box
        sx={{
          border: 1,
          borderColor: "rgb(148 163 184)",
        }}
      >
        {!isSignedIn && (
          <Box className="flex justify-center">
            <SignInButton />
          </Box>
        )}
        {isSignedIn && <CreatePostWizard />}
        <Feed />
      </Box>
    </LayoutPage>
  );
};

export default Home;
