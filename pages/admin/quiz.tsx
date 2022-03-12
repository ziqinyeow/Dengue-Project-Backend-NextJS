import Container from "components/Container";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useState } from "react";
import { prisma } from "lib/prisma";
import GradientCard from "components/GradientCard";
import QuizCard from "components/QuizCard";

const Quiz: NextPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [createQuizCardVisible, setCreateQuizCardVisible] = useState(0);
  // const filterData = question?.filter(
  //   (q) =>
  //     q?.question?.toLowerCase().includes(searchValue.toLowerCase()) ||
  //     q?.answer_scheme?.toLowerCase().includes(searchValue.toLowerCase()) ||
  //     q?.explanation?.toLowerCase().includes(searchValue.toLowerCase())
  // );
  return (
    <Container title="Admin - Quiz">
      <div className="layout">
        <h2 className="mb-8">Quiz</h2>
        <div className="flex items-center w-full gap-5 mb-4">
          <div className="relative w-full group">
            <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-blue-500 to-green-400 opacity-20 group-hover:duration-200 group-hover:opacity-100 blur" />
            <input
              className="relative w-full p-3 text-sm bg-white rounded-md focus:outline-none focus:ring focus:ring-primary-100"
              type="text"
              placeholder="Search question..."
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <GradientCard>
            <button
              className="p-3"
              onClick={() => setCreateQuizCardVisible(1)}
              title="Create Quiz"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m21.484 11.125-9.022-5a1 1 0 0 0-.968-.001l-8.978 4.96a1 1 0 0 0-.003 1.749l9.022 5.04a.995.995 0 0 0 .973.001l8.978-5a1 1 0 0 0-.002-1.749zm-9.461 4.73-6.964-3.89 6.917-3.822 6.964 3.859-6.917 3.853z"
                ></path>
                <path
                  fill="currentColor"
                  d="M12 22a.994.994 0 0 0 .485-.126l9-5-.971-1.748L12 19.856l-8.515-4.73-.971 1.748 9 5A1 1 0 0 0 12 22zm8-20h-2v2h-2v2h2v2h2V6h2V4h-2z"
                ></path>
              </svg>
            </button>
          </GradientCard>
        </div>
        <QuizCard
          show={createQuizCardVisible}
          setShow={setCreateQuizCardVisible}
        />
        {/* <div className="flex justify-end w-full mb-10 text-gray-500">
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
        )} */}
      </div>
    </Container>
  );
};

export default Quiz;

// export const getServerSideProps: GetServerSideProps = async () => {
//   const question: Question[] = await prisma.question.findMany();

//   return {
//     props: { question },
//   };
// };
