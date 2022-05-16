import Container from "components/Container";
import useSWR from "swr";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { prisma } from "lib/prisma";
import { Blood_profile } from "@prisma/client";
import { CSVLink } from "react-csv";

const Home: NextPage = ({
  blood_profile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const headers = [
    { label: "createdAt", key: "createdAt" },
    { label: "haemoglobin", key: "haemoglobin" },
    { label: "heamatocrit", key: "heamatocrit" },
    { label: "white_cell", key: "white_cell" },
    { label: "platelet", key: "platelet" },
    { label: "user_id", key: "user_id" },
  ];

  const csv_report = {
    filename: "blood_profile.csv",
    headers: headers,
    data: blood_profile,
  };

  return (
    <Container title="Blood Profile">
      <div className="layout">
        <h2 className="mb-4">Blood Profile</h2>
        <div className="flex items-center justify-end w-full mb-8 space-x-3">
          <div className="text-xs text-gray-600">
            {blood_profile?.length ?? 0} record(s)
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
        <div className="grid w-full grid-cols-7 bg-gray-100 border-2 rounded-t-sm">
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Created
            </h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Haemoglobin
            </h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Haematocrit
            </h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              White Cell
            </h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Platelet
            </h5>
          </div>
          <div className="col-span-2 px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              User ID
            </h5>
          </div>
        </div>
        {blood_profile
          ?.sort(
            (a: any, b: any) =>
              Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
          )
          .map((s: Blood_profile, i: any) => (
            <div
              key={s?.id}
              className={`grid w-full grid-cols-7 border-b-2 border-x-2`}
            >
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {new Date(s?.createdAt).toUTCString().slice(0, -4)}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.haemoglobin ?? "--"}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.haematocrit ?? "--"}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.white_cell ?? "--"}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.platelet ?? "--"}
                </h5>
              </div>
              <div className="col-span-2 px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.user_id ?? "--"}
                </h5>
              </div>
            </div>
          ))}
        {blood_profile?.length === 0 && (
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
  const blood_profile = await await prisma.blood_profile.findMany();

  return {
    props: { blood_profile: JSON.parse(JSON.stringify(blood_profile)) },
  };
};
