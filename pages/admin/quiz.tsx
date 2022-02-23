import Container from "components/Container";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useState } from "react";
import { prisma } from "lib/prisma";
import { Question } from "@prisma/client";

const Quiz: NextPage = ({
  question,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [searchValue, setSearchValue] = useState("");
  const filterData = question?.filter(
    (q: Question) =>
      q?.question?.toLowerCase().includes(searchValue.toLowerCase()) ||
      q?.answer_scheme?.toLowerCase().includes(searchValue.toLowerCase()) ||
      q?.explanation?.toLowerCase().includes(searchValue.toLowerCase())
  );
  return (
    <Container>
      <div className="layout">
        <h2 className="mb-8">Quiz</h2>
        <div className="relative w-full mb-4 group">
          <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-blue-500 to-green-400 opacity-20 group-hover:duration-200 group-hover:opacity-100 blur" />
          <input
            className="relative w-full p-3 bg-white rounded-md focus:outline-none focus:ring focus:ring-primary-100"
            type="text"
            placeholder="Search question..."
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex justify-end w-full mb-10 text-gray-500">
          {filterData.length}{" "}
          {filterData.length <= 1 ? "question" : "questions"}
        </div>
        {filterData.length === 0 ? (
          <div>
            <div>Question {searchValue} not found.</div>
          </div>
        ) : (
          <div className="relative w-full mb-10">
            <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-400 dark:to-primary-300 opacity-10 blur" />
            <div className="grid w-full grid-cols-11 py-3 text-center">
              <h4 className="col-span-1 font-bold">Rank</h4>
              <h4 className="col-span-2 font-bold">Rating</h4>
              <h4 className="col-span-2 font-bold">Stock Name</h4>
              <h4 className="col-span-2 font-bold">Stock Code</h4>
              <h4 className="col-span-2 font-bold">Bond Price</h4>
              <h4 className="col-span-2 font-bold">Bond Return</h4>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Quiz;

export const getServerSideProps: GetServerSideProps = async () => {
  const question: Question[] = await prisma.question.findMany();

  return {
    props: { question },
  };
};
