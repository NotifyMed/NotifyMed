export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/pages/api/:path*", "/pages/account", "/pages/schedule.tsx"],
};
