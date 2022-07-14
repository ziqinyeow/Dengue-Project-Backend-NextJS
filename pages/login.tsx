import Container from "components/Container";
import type { NextPage } from "next";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useData from "contexts/data";

const Home: NextPage = () => {
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const { data, removeData } = useData();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVerifying(true);
    const fetcher = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({
        email: form?.email,
        password: form?.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setVerifying(false);
    if (fetcher.ok) {
      setError("");
      router.push("/admin");
    } else {
      setError("Please key in correct credentials");
    }
  };

  const meta = {
    title: "Admin - Login",
    description: `Dengue API`,
    // image: "https://.io/static/images/banner.png",
    type: "website",
  };

  useEffect(() => {
    removeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.type]);

  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="Dengue API" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
      </Head>
      <div className="h-[100vh] w-[100vw] flex items-center justify-center">
        <form className="" onSubmit={submit}>
          <h3 className="mb-10">Login</h3>
          <h5 className="text-sm font-medium">Email</h5>
          <input
            onChange={change}
            type="email"
            name="email"
            className="px-3 py-2 text-sm border rounded-md placeholder:text-gray-300 w-80 focus:border-gray-300 focus:outline-none"
            placeholder="tim@apple.com"
            required
          />
          <h5 className="mt-5 text-sm font-medium">Password</h5>
          <input
            onChange={change}
            type="password"
            name="password"
            className="px-3 py-2 text-sm border rounded-md placeholder:text-gray-300 w-80 focus:border-gray-300 focus:outline-none"
            placeholder="... ... ..."
            required
          />
          <button
            type="submit"
            disabled={verifying}
            className="flex items-center justify-center py-3 mt-10 text-xs text-white transition-all bg-blue-700 border border-blue-700 rounded-md group hover:bg-white hover:text-blue-700 w-80"
          >
            {verifying ? (
              <svg
                className="w-5 h-5 mr-3 -ml-1 text-white group-hover:text-blue-700 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <span>Login</span>
            )}
          </button>
          <div className="mt-4 text-xs text-red-400">{error ?? ""}</div>
        </form>
      </div>
    </div>
  );
};

export default Home;
