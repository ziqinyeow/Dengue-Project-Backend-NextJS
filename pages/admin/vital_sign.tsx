import Container from "components/Container";
import useSWR from "swr";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { prisma } from "lib/prisma";
import { Vital_sign } from "@prisma/client";
import { CSVLink } from "react-csv";

const Home: NextPage = ({
  vital_sign,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const headers = [
    { label: "createdAt", key: "createdAt" },
    { label: "temperature", key: "temperature" },
    { label: "blood_pressure", key: "blood_pressure" },
    { label: "systolic", key: "systolic" },
    { label: "diastolic", key: "diastolic" },
    { label: "pulse_rate", key: "pulse_rate" },
    { label: "respiratory_rate", key: "respiratory_rate" },
    { label: "oxygen_saturation", key: "oxygen_saturation" },
    { label: "user_id", key: "user_id" },
  ];

  const csv_report = {
    filename: "vital_sign.csv",
    headers: headers,
    data: vital_sign,
  };

  return (
    <Container title="Vital Sign">
      <div className="layout">
        <h2 className="mb-4">Vital Sign</h2>
        <div className="flex items-center justify-end w-full mb-8 space-x-3">
          <div className="text-xs text-gray-600">
            {vital_sign?.length ?? 0} record(s)
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
        <div className="grid w-full grid-cols-10 bg-gray-100 border-2 rounded-t-sm">
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Created
            </h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Temperature
            </h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Blood Pressure
            </h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Systolic
            </h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Diastolic
            </h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Pulse Rate
            </h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Respiratory Rate
            </h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              Oxygen Saturation
            </h5>
          </div>
          <div className="col-span-2 px-3 py-2">
            <h5 className="overflow-hidden text-sm font-medium whitespace-nowrap text-ellipsis">
              User ID
            </h5>
          </div>
        </div>
        {vital_sign
          ?.sort(
            (a: any, b: any) =>
              Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
          )
          .map((s: Vital_sign, i: any) => (
            <div
              key={s?.id}
              className={`grid w-full grid-cols-10 border-b-2 border-x-2`}
            >
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {new Date(s?.createdAt).toUTCString().slice(0, -4)}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.temperature ?? "--"}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.blood_pressure ?? "--"}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.systolic ?? "--"}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.diastolic ?? "--"}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.pulse_rate ?? "--"}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.respiratory_rate ?? "--"}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.oxygen_saturation ?? "--"}
                </h5>
              </div>
              <div className="col-span-2 px-3 py-2">
                <h5 className="overflow-hidden text-sm whitespace-nowrap text-ellipsis">
                  {s?.user_id ?? "--"}
                </h5>
              </div>
            </div>
          ))}
        {vital_sign?.length === 0 && (
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
  const vital_sign = await await prisma.vital_sign.findMany();

  return {
    props: { vital_sign: JSON.parse(JSON.stringify(vital_sign)) },
  };
};
