import Container from "components/Container";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useState } from "react";
import { prisma } from "lib/prisma";
import { User } from "@prisma/client";
import Link from "next/link";

const Quiz: NextPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [searchValue, setSearchValue] = useState("");
  const filterData = user?.filter(
    (u: User) =>
      u?.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      u?.username?.toLowerCase().includes(searchValue.toLowerCase()) ||
      u?.ic?.toLowerCase().includes(searchValue.toLowerCase())
  );
  return (
    <Container title="Admin - User">
      <div className="layout">
        <h2 className="mb-8">User</h2>
        <div className="relative w-full mb-4 group">
          <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-blue-500 to-green-400 opacity-20 group-hover:duration-200 group-hover:opacity-100 blur" />
          <input
            className="relative w-full p-3 bg-white rounded-md focus:outline-none focus:ring focus:ring-primary-100"
            type="text"
            placeholder="Search user..."
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex justify-end w-full mb-10 text-gray-500">
          {filterData.length} {filterData.length <= 1 ? "user" : "users"}
        </div>
        {filterData.length === 0 ? (
          <div>
            <div>User {searchValue} not found.</div>
          </div>
        ) : (
          <div className="relative w-full mb-10">
            <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-blue-700 to-green-500 dark:from-primary-400 dark:to-primary-300 opacity-10 blur" />
            <div className="grid w-full grid-cols-10 py-3 text-center">
              <h4 className="col-span-1 font-bold">No</h4>
              <h4 className="col-span-2 font-bold">Email</h4>
              <h4 className="col-span-2 font-bold">Name</h4>
              <h4 className="col-span-2 font-bold">IC No</h4>
              <h4 className="col-span-2 font-bold">Phone No</h4>
              <h4 className="col-span-1 font-bold">Patient</h4>
            </div>
          </div>
        )}
        {filterData.map((d: User, i: number) => (
          <Link key={d?.id} href={`/admin/user/${d?.id}`}>
            <a className="relative w-full mb-4 group">
              <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-blue-500 to-green-200 opacity-20 group-hover:duration-200 group-hover:opacity-100 blur" />
              <div className="relative grid w-full grid-cols-10 py-5 text-center bg-white rounded-md">
                <h5 className="col-span-1 break-all">{i + 1}</h5>
                <h5 className="col-span-2 break-all">{d?.email}</h5>
                <h5 className="col-span-2 break-all">{d?.username}</h5>
                <h5 className="col-span-2 break-all">{d?.ic}</h5>
                <h5 className="col-span-2 break-all">{d?.phone_no}</h5>
                <h5 className="col-span-1 break-all">
                  <span
                    className={`px-2 py-1 text-sm border rounded ${
                      d?.group === 0
                        ? "bg-green-200 border-green-100"
                        : "bg-red-200 border-red-100"
                    }`}
                  >
                    {d?.group === 0 ? "No" : "Yes"}
                  </span>
                </h5>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Container>
  );
};

export default Quiz;

export const getServerSideProps: GetServerSideProps = async () => {
  const user: User[] = await prisma.user.findMany();

  return {
    props: { user },
  };
};
