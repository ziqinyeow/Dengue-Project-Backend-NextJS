import Container from "components/Container";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useEffect, useState } from "react";
import { prisma } from "lib/prisma";
import GradientCard from "components/GradientCard";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import UserInfo from "components/UserInfo";
import { CSVLink } from "react-csv";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function time_diff(dateFuture: Date) {
  const now = new Date();
  // @ts-ignore
  let diffInMilliSeconds = Math.abs(dateFuture - now) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  // console.log("calculated days", days);

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  // console.log("calculated hours", hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  // console.log("minutes", minutes);

  let difference = "";
  if (days > 0) {
    difference += `${days} `;
  }

  difference += `${hours} ${minutes}`;

  return difference;
}

const User: NextPage = ({
  user,
  patient,
  module_progress,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [more, setMore] = useState(false);
  // console.log(user, patient, module_progress);

  const diff = time_diff(patient?.start);

  const latest_symptom = user?.symptom[user?.symptom?.length - 1];

  const vital_sign_date = user?.vital_sign?.map((v: any) =>
    new Date(v?.createdAt).toLocaleDateString()
  );

  const vital_sign = {
    labels: vital_sign_date,
    datasets: [
      {
        label: "Temperature",
        data: user?.vital_sign?.map((v: any) => Number(v?.temperature)),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Oxygen Saturation",
        data: user?.vital_sign?.map((v: any) => Number(v?.oxygen_saturation)),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Pulse Rate",
        data: user?.vital_sign?.map((v: any) => Number(v?.pulse_rate)),
        borderColor: "rgba(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.5)",
      },
      {
        label: "Respiratory Rate",
        data: user?.vital_sign?.map((v: any) => Number(v?.respiratory_rate)),
        borderColor: "rgba(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Blood Pressure",
        data: user?.vital_sign?.map((v: any) => Number(v?.blood_pressure)),
        borderColor: "rgba(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };

  const blood_profile_date = user?.blood_profile?.map((v: any) =>
    new Date(v?.createdAt).toLocaleDateString()
  );

  const blood_profile = {
    labels: blood_profile_date,
    datasets: [
      {
        label: "Haematocrit",
        data: user?.blood_profile?.map((b: any) => Number(b?.haematocrit)),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Haemoglobin",
        data: user?.blood_profile?.map((b: any) => Number(b?.haemoglobin)),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "White Cell",
        data: user?.blood_profile?.map((b: any) => Number(b?.white_cell)),
        borderColor: "rgba(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.5)",
      },
      {
        label: "Platelet",
        data: user?.blood_profile?.map((b: any) => Number(b?.platelet)),
        borderColor: "rgba(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const desca_quiz_completeness = {
    labels: [
      "Module 1",
      "Module 2",
      "Module 3",
      "Module 4",
      "Module 5",
      "Module 6",
      "Module 7",
    ],
    datasets: [
      {
        label: "Progress",
        // data: Object.values(module_progress),
        data: [100, 100, 100, 100],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const headers = [
    { label: "email", key: "email" },
    { label: "name", key: "name" },
    { label: "ic", key: "ic" },
    { label: "phone_no", key: "phone_no" },
    { label: "diagnose_start_date", key: "diagnose_start_date" },
    { label: "day_illness", key: "day_illness" },
    { label: "address", key: "address" },
    { label: "postcode", key: "postcode" },
    { label: "state", key: "state" },
    { label: "group", key: "group" },
  ];

  const csv_report = {
    filename: "user.csv",
    headers: headers,
    data: [
      {
        name: user?.username,
        email: user?.email,
        ic: user?.ic,
        phone_no: user?.phone_no,
        diagnose_start_date: new Date(patient?.start).toLocaleDateString(),
        day_illness: Math.round(
          (new Date().getTime() - new Date(patient.start).getTime()) /
            (1000 * 3600 * 24)
        ),
        address: user?.address,
        postcode: user?.postcode,
        state: user?.state,
        group: user?.group,
      },
    ],
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Container title={`User - ${user?.email}`}>
      <div className="layout">
        <h2 className="mb-5">User</h2>
        <div className="flex items-center w-full gap-5 mb-10">
          <div className="relative w-full">
            <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-blue-500 to-green-400 opacity-20 group-hover:duration-200 blur" />
            <div className="relative w-full p-4 text-sm bg-white rounded-md focus:outline-none focus:ring focus:ring-primary-100">
              <div className="flex items-center justify-between w-full mb-5">
                <h4 className="overflow-hidden font-bold whitespace-nowrap text-ellipsis">
                  Profile
                  {latest_symptom?.status && (
                    <span className={`px-2 text-sm`}>
                      ( Current Symptom:{" "}
                      <span
                        className={`px-2 py-1 text-white rounded ${
                          latest_symptom?.status === "normal"
                            ? "bg-green-400"
                            : "bg-red-400"
                        }`}
                      >
                        {latest_symptom?.status ?? "--"}
                      </span>{" "}
                      )
                    </span>
                  )}
                </h4>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 text-sm text-white rounded-md ${
                      user?.group === "patient" ? "bg-red-400" : "bg-green-400"
                    }`}
                  >
                    <div>{user?.group}</div>
                  </div>
                  {more && (
                    <GradientCard>
                      <CSVLink {...csv_report}>
                        <button className="flex items-center gap-2 px-3 py-1 text-sm rounded-md">
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
                    </GradientCard>
                  )}
                  <GradientCard>
                    {!more ? (
                      <button
                        onClick={() => {
                          setMore(true);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-xs rounded-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path
                            fill="currentColor"
                            d="M3 4h18v2H3V4zm0 15h18v2H3v-2zm8-5h10v2H11v-2zm0-5h10v2H11V9zm-8 3.5L7 9v7l-4-3.5z"
                          />
                        </svg>
                        more
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setMore(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-xs rounded-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path
                            fill="currentColor"
                            d="M3 4h18v2H3V4zm0 15h18v2H3v-2zm8-5h10v2H11v-2zm0-5h10v2H11V9zm-4 3.5L3 16V9l4 3.5z"
                          />
                        </svg>
                        less
                      </button>
                    )}
                  </GradientCard>
                </div>
              </div>
              <div className="w-full">
                <UserInfo title="Name" content={user?.username} />
                <UserInfo title="Email" content={user?.email} />
                <UserInfo
                  title="Diagnose Start Date"
                  content={new Date(patient?.start).toLocaleDateString()}
                />
                <UserInfo
                  title="Day of Illness"
                  content={Math.round(
                    (new Date().getTime() - new Date(patient.start).getTime()) /
                      (1000 * 3600 * 24)
                  )}
                />
                {more && (
                  <div className="w-full">
                    <UserInfo
                      title="Identity Card No (IC)"
                      content={user?.ic}
                    />
                    <UserInfo title="Age" content={user?.age} />
                    <UserInfo
                      title="Sex"
                      content={
                        user?.gender != null
                          ? user?.gender === "0"
                            ? "male"
                            : "female"
                          : "--"
                      }
                    />
                    <UserInfo title="Phone No" content={user?.phone_no} />
                    <UserInfo title="Address" content={user?.address} />
                    <UserInfo
                      title="Postcode/State"
                      content={
                        user?.postcode && user?.state
                          ? `${user?.postcode}/${user?.state}`
                          : "--"
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <h4 className="mb-3 font-bold">Current Symptom</h4>
        <div className="grid w-full grid-cols-3 bg-gray-100 border-2 rounded-t-sm">
          <div className="px-3 py-2">
            <h5 className="text-sm font-medium">Created</h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="text-sm font-medium">Status</h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="text-sm font-medium">Day</h5>
          </div>
        </div>
        {user?.symptom
          .filter((s: any) => new Date(s.createdAt) > new Date(patient.start))
          ?.sort(
            (a: any, b: any) =>
              Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
          )
          .map((s: any, i: any) => (
            <div
              key={s?.id}
              className={`grid w-full grid-cols-3 border-b-2 border-x-2`}
            >
              <div className="px-3 py-2">
                <h5 className="text-sm">
                  {new Date(s?.createdAt).toUTCString().slice(0, -4)}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="text-sm">
                  {s?.status === "" || s?.status == null ? "--" : s?.status}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="text-sm">
                  {Math.round(
                    (new Date(s.createdAt).getTime() -
                      new Date(patient.start).getTime()) /
                      (1000 * 3600 * 24)
                  )}
                </h5>
              </div>
            </div>
          ))}
        {user?.symptom?.filter(
          (s: any) => new Date(s.createdAt) > new Date(patient.start)
        ).length === 0 && (
          <div className={`grid w-full grid-cols-3 border-b-2 border-x-2`}>
            <div className="px-3 py-2">
              <h5 className="text-sm">No current symptom yet</h5>
            </div>
          </div>
        )}
        <h4 className="mt-10 mb-3 font-bold">Symptom History</h4>
        <div className="grid w-full grid-cols-2 bg-gray-100 border-2 rounded-t-sm">
          <div className="px-3 py-2">
            <h5 className="text-sm font-medium">Created</h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="text-sm font-medium">Status</h5>
          </div>
        </div>
        {user?.symptom
          .filter((s: any) => new Date(s.createdAt) < new Date(patient.start))
          ?.sort(
            (a: any, b: any) =>
              Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
          )
          .map((s: any, i: any) => (
            <div
              key={s?.id}
              className={`grid w-full grid-cols-2 border-b-2 border-x-2`}
            >
              <div className="px-3 py-2">
                <h5 className="text-sm">
                  {new Date(s?.createdAt).toUTCString().slice(0, -4)}
                </h5>
              </div>
              <div className="px-3 py-2">
                <h5 className="text-sm">
                  {s?.status === "" || s?.status == null ? "--" : s?.status}
                </h5>
              </div>
            </div>
          ))}
        {user?.symptom?.filter(
          (s: any) => new Date(s.createdAt) < new Date(patient.start)
        ).length === 0 && (
          <div className={`grid w-full grid-cols-3 border-b-2 border-x-2`}>
            <div className="px-3 py-2">
              <h5 className="text-sm">No symptom history yet</h5>
            </div>
          </div>
        )}
        <h4 className="mt-10 mb-3 font-bold">Dengue Diagnose History</h4>
        <div className="grid w-full grid-cols-3 bg-gray-100 border-2 rounded-t-sm">
          <div className="px-3 py-2">
            <h5 className="text-sm font-medium">Created</h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="text-sm font-medium">End</h5>
          </div>
          <div className="px-3 py-2">
            <h5 className="text-sm font-medium">Status</h5>
          </div>
        </div>
        {user?.history?.length === 0 && (
          <div className={`grid w-full grid-cols-3 border-b-2 border-x-2`}>
            <div className="px-3 py-2">
              <h5 className="text-sm">No history yet</h5>
            </div>
          </div>
        )}
        {user?.history?.reverse().map((h: any, i: any) => (
          <div
            key={h?.id}
            className={`grid w-full grid-cols-3 border-b-2 border-x-2`}
          >
            <div className="px-3 py-2">
              <h5 className="text-sm">
                {new Date(h?.start).toUTCString().slice(0, -4)}
              </h5>
            </div>
            <div className="px-3 py-2">
              <h5 className="text-sm">
                {new Date(h?.end).toUTCString().slice(0, -4)}
              </h5>
            </div>
            <div className="px-3 py-2">
              <h5 className="text-sm">{h?.status === "" ? "--" : h?.status}</h5>
            </div>
          </div>
        ))}

        <div className="w-full mt-10">
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <h4 className="mb-5 font-bold">Vital Sign</h4>
              <div className="p-5 border-2 rounded">
                <Line
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                    },
                  }}
                  data={vital_sign}
                />
              </div>
            </div>
            <div>
              <h4 className="mb-5 font-bold">Blood Profile</h4>
              <div className="p-5 border-2 rounded">
                <Line
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                    },
                  }}
                  data={blood_profile}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mt-10">
          <h4 className="mb-5 font-bold">Desca Quiz Completeness</h4>
          <div className="p-5 border-2 rounded">
            <Line
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                },
              }}
              data={desca_quiz_completeness}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default User;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        // @ts-ignore
        id: params?.id,
      },
      include: {
        vital_sign: true,
        blood_profile: true,
        answer: true,
        history: true,
        symptom: true,
        seek_help_form: true,
      },
    });
    if (!user) {
      return {
        notFound: true,
      };
    }

    let module_1 = Math.max.apply(
      Math,
      // @ts-ignore
      user?.answer
        .filter((d: any) => d.module === 1)
        .map(function (m: any) {
          return m?.answer?.split(" ").length;
        })
    );

    let module_2 = Math.max.apply(
      Math,
      // @ts-ignore
      user?.answer
        .filter((d: any) => d.module === 2)
        .map(function (m: any) {
          return m?.answer?.split(" ").length;
        })
    );
    let module_3 = Math.max.apply(
      Math,
      // @ts-ignore
      user?.answer
        .filter((d: any) => d.module === 3)
        .map(function (m: any) {
          return m?.answer?.split(" ").length;
        })
    );
    let module_4 = Math.max.apply(
      Math,
      // @ts-ignore
      user?.answer
        .filter((d: any) => d.module === 4)
        .map(function (m: any) {
          return m?.answer?.split(" ").length;
        })
    );
    let module_5 = Math.max.apply(
      Math,
      // @ts-ignore
      user?.answer
        .filter((d: any) => d.module === 5)
        .map(function (m: any) {
          return m?.answer?.split(" ").length;
        })
    );
    let module_6 = Math.max.apply(
      Math,
      // @ts-ignore
      user?.answer
        .filter((d: any) => d.module === 6)
        .map(function (m: any) {
          return m?.answer?.split(" ").length;
        })
    );
    let module_7 = Math.max.apply(
      Math,
      // @ts-ignore
      user?.answer
        .filter((d: any) => d.module === 7)
        .map(function (m: any) {
          return m?.answer?.split(" ").length;
        })
    );

    const module_question = [15, 6, 6, 7, 7, 5, 4];
    let module_progress = {
      module_1: module_1 == null ? 0 : (module_1 / module_question[0]) * 100,
      module_2: module_2 == null ? 0 : (module_2 / module_question[1]) * 100,
      module_3: module_3 == null ? 0 : (module_3 / module_question[2]) * 100,
      module_4: module_4 == null ? 0 : (module_4 / module_question[3]) * 100,
      module_5: module_5 == null ? 0 : (module_5 / module_question[4]) * 100,
      module_6: module_6 == null ? 0 : (module_6 / module_question[5]) * 100,
      module_7: module_7 == null ? 0 : (module_7 / module_question[6]) * 100,
    };

    const patient = await prisma.patient.findMany({
      where: {
        // @ts-ignore
        user_id: params?.id,
      },
      orderBy: {
        start: "desc",
      },
      take: 1,
    });

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        patient: JSON.parse(JSON.stringify(patient[0])),
        module_progress,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
