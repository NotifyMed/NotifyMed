import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/account");
    }
  }, [session, router]);

  return (
    <>
      <p>You are not signed in</p>
      <button
        onClick={() => signIn()}
        className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
      >
        Sign In
      </button>
    </>
  );
}
