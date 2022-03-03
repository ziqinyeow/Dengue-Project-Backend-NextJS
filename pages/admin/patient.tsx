import Container from "components/Container";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useState } from "react";
import { prisma } from "lib/prisma";
import { Patient } from "@prisma/client";
import Link from "next/link";
import useData from "contexts/data";

const Quiz: NextPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const { data } = useData();

  const filterData = data?.patient?.filter(
    (p: Patient) =>
      p?.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      p?.ic?.toLowerCase().includes(searchValue.toLowerCase())
  );
  return (
    <Container title="Admin - Patient">
      <div className="layout">
        <h2 className="mb-8">Patient</h2>
        <div className="relative w-full mb-4 group">
          <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-blue-500 to-green-400 opacity-20 group-hover:duration-200 group-hover:opacity-100 blur" />
          <input
            className="relative w-full p-3 text-sm bg-white rounded-md focus:outline-none focus:ring focus:ring-primary-100"
            type="text"
            placeholder="Search patient..."
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex justify-end w-full mb-10 text-gray-500">
          {filterData?.length}{" "}
          {filterData?.length <= 1 ? "patient" : "patients"}
        </div>
        {filterData?.length === 0 ? (
          <div>
            <div>Patient {searchValue} not found.</div>
          </div>
        ) : (
          <div className="relative w-full mb-10">
            <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-blue-700 to-green-500 dark:from-primary-400 dark:to-primary-300 opacity-10 blur" />
            <div className="grid w-full grid-cols-5 py-3 text-center">
              <h4 className="col-span-1 font-bold">No</h4>
              <h4 className="col-span-2 font-bold">Email</h4>
              <h4 className="col-span-2 font-bold">IC No</h4>
            </div>
          </div>
        )}
        {filterData?.map((d: Patient, i: number) => (
          <Link key={d?.id} href={`/admin/user/${d?.id}`}>
            <a className="relative w-full mb-4 group">
              <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-blue-500 to-green-200 opacity-20 group-hover:duration-200 group-hover:opacity-100 blur" />
              <div className="relative grid w-full grid-cols-5 py-5 text-center bg-white rounded-md">
                <h5 className="col-span-1 break-all">{i + 1}</h5>
                <h5 className="col-span-2 break-all">{d?.email}</h5>
                <h5 className="col-span-2 break-all">{d?.ic}</h5>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Container>
  );
};

export default Quiz;

// export const getServerSideProps: GetServerSideProps = async () => {
//   const patient: Patient[] = await prisma.patient.findMany();

//   return {
//     props: { patient },
//   };
// };
