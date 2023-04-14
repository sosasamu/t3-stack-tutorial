import { Box, CircularProgress } from "@mui/material";

export const SubmitPostLoading = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CircularProgress />
  </Box>
);
