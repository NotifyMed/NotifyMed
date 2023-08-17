import { GetServerSidePropsContext } from "next";
import { signIn, getSession } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-dark">
      <div className="max-w-md w-full rounded-lg ">
        <p className="text-center text-white text-2xl font-bold mb-4">Log in</p>
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={() => signIn("google")}
            className="py-2 px-4 text-white hover:text-black font-semibold rounded-md shadow hover:bg-white border border-white flex items-center"
          >
            <div className="mr-2">
              <Image
                src="/images/icons/google.svg"
                alt="Icon"
                width={24}
                height={24}
              />
            </div>
            <span>Log in with Google</span>
          </button>
        </div>
        <p className="text-center text-gray-500 font-light mb-4">
          By logging into Notify Med, you are agreeing to our disclaimer.
        </p>
      </div>
    </section>
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
