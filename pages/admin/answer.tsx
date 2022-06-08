import Container from "components/Container";
import useSWR from "swr";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { prisma } from "lib/prisma";
import { Answer } from "@prisma/client";
import { CSVLink } from "react-csv";
import GradientCard from "components/GradientCard";
import { useState } from "react";

const Home: NextPage = ({
  answer,
  no_user_completed_modules,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const headers = [
    { label: "createdAt", key: "createdAt" },
    { label: "module", key: "module" },
    { label: "answer", key: "answer" },
    { label: "no_correct", key: "no_correct" },
    { label: "user_id", key: "user_id" },
  ];

  const csv_report = {
    filename: "answer.csv",
    headers: headers,
    data: answer,
  };

  return (
    <Container title="Answer">
      <div className="layout">
        <div className="flex items-center justify-between w-full mb-5">
          <h2 className="mb-4">Answer</h2>
          <GradientCard>
            <button
              className="p-3"
              onClick={() => setShowAnalytics(!showAnalytics)}
              title="Show some metrics"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0L24 0 24 24 0 24z" />
                <path
                  fill="currentColor"
                  d="M16 16c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zM6 12c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm8.5-10C17.538 2 20 4.462 20 7.5S17.538 13 14.5 13 9 10.538 9 7.5 11.462 2 14.5 2z"
                />
              </svg>
            </button>
          </GradientCard>
        </div>
        {showAnalytics && (
          <div className="w-full">
            <div className="mb-5">
              <h5 className="text-sm text-gray-600">
                Total user completed by each module
              </h5>
            </div>
            <div className="grid w-full gap-5 mb-10 md:grid-cols-4 2xl:grid-cols-7">
              <GradientCard className="p-5">
                <h4 className="mb-2">Module 1</h4>
                <h2>{no_user_completed_modules[0] ?? "--"}</h2>
              </GradientCard>
              <GradientCard className="p-5">
                <h4 className="mb-2">Module 2</h4>
                <h2>{no_user_completed_modules[1] ?? "--"}</h2>
              </GradientCard>
              <GradientCard className="p-5">
                <h4 className="mb-2">Module 3</h4>
                <h2>{no_user_completed_modules[2] ?? "--"}</h2>
              </GradientCard>
              <GradientCard className="p-5">
                <h4 className="mb-2">Module 4</h4>
                <h2>{no_user_completed_modules[3] ?? "--"}</h2>
              </GradientCard>
              <GradientCard className="p-5">
                <h4 className="mb-2">Module 5</h4>
                <h2>{no_user_completed_modules[4] ?? "--"}</h2>
              </GradientCard>
              <GradientCard className="p-5">
                <h4 className="mb-2">Module 6</h4>
                <h2>{no_user_completed_modules[5] ?? "--"}</h2>
              </GradientCard>
              <GradientCard className="p-5">
                <h4 className="mb-2">Module 7</h4>
                <h2>{no_user_completed_modules[6] ?? "--"}</h2>
              </GradientCard>
            </div>
          </div>
        )}
        <div className="flex items-center justify-end w-full mb-8 space-x-3">
          <div className="text-xs text-gray-600">
            {answer?.length ?? 0} record(s)
          </div>
          <CSVLink {...csv_report}>
            <button className="flex items-center gap-2 px-3 py-1 text-sm border rounded-md disabled:text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  fill="currentColor"
                  d="M2.859 2.877l12.57-1.795a.5.5 0 0 1 .571.495v20.846a.5.5 0 0 1-.57.495L2.858 21.123a1 1 0 0 1-.859-.99V3.867a1 1 0 0 1 .859-.99zM4 4.735v14.53l10 1.429V3.306L4 4.735zM17 19h3V5h-3V3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4v-2zm-6.8-7l2.8 4h-2.4L9 13.714 7.4 16H5l2.8-4L5 8h2.4L9 10.286 10.6 8H13l-2.8 4z"
                />
              </svg>
              <div>csv</div>
            </button>
          </CSVLink>
        </div>
        <div className="grid w-full grid-cols-5 bg-gray-100 border-2 rounded-t-sm">
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Created
            </h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Module
            </h5>
          </div>
          {/* <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Answer
            </h5>
          </div> */}
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              No Correct
            </h5>
          </div>
          <div className="col-span-2 px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              User ID
            </h5>
          </div>
        </div>
        {answer
          ?.sort(
            (a: any, b: any) =>
              Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
          )
          .map((s: Answer, i: any) => (
            <div
              key={s?.id}
              className={`grid w-full grid-cols-5 border-b-2 border-x-2`}
            >
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {new Date(s?.createdAt).toUTCString().slice(0, -4)}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.module ?? "--"}
                </h5>
              </div>
              {/* <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.answer ?? "--"}
                </h5>
              </div> */}
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.no_correct ?? "--"}
                </h5>
              </div>
              <div className="col-span-2 px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.user_id ?? "--"}
                </h5>
              </div>
            </div>
          ))}
        {answer?.length === 0 && (
          <div className={`grid w-full grid-cols-3 border-b-2 border-x-2`}>
            <div className="px-3 py-2">
              <h5 className="text-sm">No record yet</h5>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const answer = await await prisma.answer.findMany();
  const group = (xs: any, prop: any) => {
    let grouped: any = {};
    for (var i = 0; i < xs.length; i++) {
      var p = xs[i][prop];
      if (!grouped[p]) {
        grouped[p] = [];
      }
      grouped[p].push(xs[i]);
    }
    return grouped;
  };
  const module_question = [15, 6, 6, 7, 7, 5, 4];

  // function that takes in an array of object
  // get the maximum of a property based on its unique id
  // we have multiple unique id
  const magic = (array: Answer[], module_no: number) => {
    let no_user_completed_module = 0;
    const module_answer_group_by_user = group(array, "user_id");
    Object.keys(module_answer_group_by_user).map((key, index) => {
      const no_of_question_answered = Math.max(
        ...module_answer_group_by_user[key].map(
          (a: Answer) => a?.answer?.split(" ").length
        )
      );
      if (module_question[module_no - 1] == no_of_question_answered) {
        no_user_completed_module += 1;
      }
    });
    return no_user_completed_module;
  };

  const answer_group_by_module = group(answer, "module");
  const no_user_completed_modules: number[] = [];
  Object.keys(answer_group_by_module).map((key, index) => {
    const n = magic(answer_group_by_module[Number(key)], Number(key));
    no_user_completed_modules.push(n);
  });

  return {
    props: {
      answer: JSON.parse(JSON.stringify(answer)),
      no_user_completed_modules: no_user_completed_modules,
    },
  };
};
