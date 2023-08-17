export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/pages/api/user",
    "/pages/api/medication",
    "/pages/api/auth/[...nextauth]",
  ],
};
