import Container from "components/Container";
import type { NextPage } from "next";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useData from "contexts/data";

const Home: NextPage = () => {
  const router = useRouter();
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
    if (fetcher.ok) {
      router.push("/admin");
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
          />
          <h5 className="mt-5 text-sm font-medium">Password</h5>
          <input
            onChange={change}
            type="password"
            name="password"
            className="px-3 py-2 text-sm border rounded-md placeholder:text-gray-300 w-80 focus:border-gray-300 focus:outline-none"
            placeholder="... ... ..."
          />
          <button
            type="submit"
            className="flex justify-center py-3 mt-10 text-xs text-white transition-all bg-blue-700 border border-blue-700 rounded-md hover:bg-white hover:text-blue-700 w-80"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
