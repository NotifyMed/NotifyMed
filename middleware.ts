export { default } from "next-auth/middleware";

export const config = {
  matches: ["/api/:path*", "/account", "/schedule.tsx"],
};
