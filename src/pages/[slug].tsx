import { Box, Divider, Typography } from "@mui/material";

import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <Loading />;

  if (!data || data.length === 0) return <Box>No posts yet</Box>;

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

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <Box>404</Box>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <LayoutPage>
        <Box
          sx={{
            backgroundColor: "#475569",
            position: "relative",
            height: "192px",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              marginBottom: "-64px",
              marginLeft: "16px",
            }}
          >
            <Image
              src={data.profileImageUrl}
              alt={`${data.username ?? ""}'s profile picture`}
              width={128}
              height={128}
              style={{
                borderRadius: "50%",
                border: "6px solid black",
              }}
            />
          </Box>
        </Box>
        <Box sx={{ height: "64px" }}></Box>
        <Box
          sx={{
            padding: "16px",
          }}
        >
          <Typography variant="h5">{`@${data.username ?? ""}`}</Typography>
        </Box>
        <Divider sx={{ borderColor: "#475569", borderBottomWidth: "medium" }} />
        <ProfileFeed userId={data.id} />
      </LayoutPage>
    </>
  );
};

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import SuperJSON from "superjson";
import { LayoutPage } from "~/components/layout";
import Image from "next/image";
import { Loading } from "~/components/loaders/loading";
import { PostView } from "~/components/postview";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
