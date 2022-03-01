import Container from "components/Container";
import type { NextPage } from "next";
import { ChangeEvent, FormEvent, useState } from "react";
import Head from "next/head";

const Home: NextPage = () => {
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
    console.log("form", form);

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
    console.log("fetcher", fetcher);

    const data = await fetcher.json();
    console.log(data);
  };

  return (
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
  );
};

export default Home;
