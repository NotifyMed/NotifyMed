import { GetServerSidePropsContext } from "next";
import { useSession, signOut, getSession } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  const { data: session, status } = useSession({ required: true });

  return (
    <>
      {status === "authenticated"}
      <div>
        <p>Welcome back {session?.user?.name}!</p>
        <Image
          src={session?.user?.image ?? ""}
          alt={`${session?.user?.name}'s profile picture`}
          height={100}
          width={100}
          className="rounded-full border-4 border-blue-500"
        />
        <button
          onClick={() => signOut()}
          className="m-2 mt-4 py-2 px-4 bg-red-500 text-white rounded-md shadow hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
      {status !== "authenticated" && (
        <div>
          <p>You are not signed in</p>
        </div>
      )}
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};
