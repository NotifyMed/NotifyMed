import { GetServerSidePropsContext } from "next";
import { signIn, getSession } from "next-auth/react";

export default function Login() {
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  const { query } = context;

  if (session) {
    const destination = query.previous ? `/${query.previous}` : "/account";
    return {
      redirect: {
        destination,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
