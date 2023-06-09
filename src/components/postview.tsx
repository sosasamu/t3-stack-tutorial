import { Box, ImageListItem, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  const router = useRouter();

  const handleClick = async (
    e: React.MouseEvent<HTMLElement>,
    path: string
  ) => {
    e.preventDefault();
    await router.push(path);
  };

  return (
    <Box
      key={post.id}
      sx={{
        borderBottom: 1,
        borderColor: "rgb(148 163 184)",
        display: "flex",
        p: 4,
      }}
    >
      <Link
        href={`/@${author.username}`}
        onClick={(e) => {
          void handleClick(e, `/@${author.username}`);
        }}
      >
        <ImageListItem sx={{ marginRight: 2, height: 56, width: 56 }}>
          <Image
            src={author.profileImageUrl}
            alt={`@${author.username}'s profile picture`}
            style={{ borderRadius: "50%" }}
            width={56}
            height={56}
          />
        </ImageListItem>
      </Link>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ alignItems: "center", color: "#cbd5e1", display: "flex" }}>
          <Link
            href={`/@${author.username}`}
            onClick={(e) => {
              void handleClick(e, `/@${author.username}`);
            }}
          >
            <Typography
              variant="body1"
              sx={{ marginRight: 1 }}
            >{`@${author.username}`}</Typography>
          </Link>
          <Link
            href={`/post/${post.id}`}
            onClick={(e) => {
              void handleClick(e, `/post/${post.id}`);
            }}
          >
            <Typography variant="body2">{`· ${dayjs(
              post.createdAt
            ).fromNow()}`}</Typography>
          </Link>
        </Box>
        <Box component="span">
          <Typography variant="h6">{post.content}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
