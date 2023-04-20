import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";

export const GoBack = () => {
  const router = useRouter();

  return (
    <Link href={"/"} onClick={() => router.back()}>
      <ArrowBackIcon />
    </Link>
  );
};
