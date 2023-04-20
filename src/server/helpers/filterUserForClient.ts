import type { User } from "@clerk/nextjs/dist/api";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress,
  };
};
