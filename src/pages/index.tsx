import { SignInButton, useUser } from "@clerk/nextjs";
import {
  Alert,
  Box,
  Button,
  Dialog,
  Grid,
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
import EmojiPicker from "emoji-picker-react";
import Link from "next/link";
import { useRouter } from "next/router";

export interface State extends SnackbarOrigin {
  message: string | undefined;
  open: boolean;
}

const CreatePostWizard = () => {
  const { user } = useUser();
  console.log(user);

  const [input, setInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarState, setSnackbarState] = useState<State>({
    horizontal: "center",
    message: "",
    open: false,
    vertical: "bottom",
  });
  const { vertical, horizontal, open, message } = snackbarState;
  const router = useRouter();

  const handleCloseSnackBar = () => {
    setSnackbarState((state) => ({ ...state, open: false }));
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleLinkClick = async (
    e: React.MouseEvent<HTMLElement>,
    path: string
  ) => {
    e.preventDefault();
    await router.push(path);
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
        alignItems: "center",
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
      <Link
        href={`/@${user?.username ?? ""}`}
        onClick={(e) => {
          void handleLinkClick(e, `/@${user?.username ?? ""}`);
        }}
      >
        <ImageListItem sx={{ height: 56, width: 56 }}>
          <Image
            src={user?.profileImageUrl}
            alt="profileImage"
            style={{ borderRadius: "50%" }}
            width={56}
            height={56}
          />
        </ImageListItem>
      </Link>
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
      {/* EMOJI PICKER DIALOG */}
      <Dialog onClose={handleCloseDialog} open={dialogOpen}>
        <EmojiPicker
          onEmojiClick={(emojiData) =>
            setInput((input) => `${input}${emojiData.emoji}`)
          }
        />
      </Dialog>
      <Box>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {!isPosting && (
            <Button
              sx={{ marginBottom: "5px", maxWidth: "70px" }}
              onClick={() => setDialogOpen(true)}
              variant="text"
            >
              Emojis
            </Button>
          )}
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
        </Grid>
      </Box>
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
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="outlined">
              <SignInButton />
            </Button>
          </Box>
        )}
        {isSignedIn && <CreatePostWizard />}
        <Feed />
      </Box>
    </LayoutPage>
  );
};

export default Home;
