import { forwardRef, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { Logout } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const SignOutButton = () => {
  const [open, setOpen] = useState(false);
  const { signOut } = useClerk();

  const handleLogout = () => {
    void signOut();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Sign Out"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to sign out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleLogout}>Sign Out</Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="text"
        color="inherit"
        startIcon={<Logout />}
        onClick={handleOpen}
      >
        Sign out
      </Button>
    </>
  );
};
