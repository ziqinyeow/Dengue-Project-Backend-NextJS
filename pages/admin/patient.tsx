import Container from "components/Container";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useState } from "react";
import { Patient, User } from "@prisma/client";
import GradientCard from "components/GradientCard";
import useData from "contexts/data";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { CSVLink } from "react-csv";
import UpdateUserCard from "components/UpdateUserCard";
import Link from "next/link";
import CreatePatientCard from "components/CreatePatientCard";

const User: NextPage = () => {
  const router = useRouter();
  const { data } = useData();
  const [searchValue, setSearchValue] = useState("");
  const [select, setSelect] = useState<User[]>([]);
  const [createPatientCardVisible, setCreatePatientCardVisible] = useState(0);
  const [updatePatientCardVisible, setUpdatePatientCardVisible] = useState(0);
  const [updatePatientData, setUpdatePatientData] = useState({
    id: "",
    email: "",
    type: "",
    ic: "",
  });

  const headers = [
    { label: "email", key: "email" },
    { label: "username", key: "username" },
    { label: "fullname", key: "fullname" },
    { label: "ic", key: "ic" },
    { label: "group", key: "group" },
    { label: "phone_no", key: "phone_no" },
    { label: "address", key: "address" },
    { label: "postcode", key: "postcode" },
    { label: "state", key: "state" },
  ];

  const csv_report = {
    filename: "patient.csv",
    headers: headers,
    data: select,
  };

  const filterData = data?.patient?.filter(
    (d: Patient) =>
      d?.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      d?.ic?.toLowerCase().includes(searchValue.toLowerCase()) ||
      d?.status?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Container title="Admin - Patient">
      <div className="layout">
        <h2 className="mb-5">Patient</h2>
        <h5 className="mb-8 text-sm text-gray-500">
          All admins are able to view this page.
        </h5>
        <div className="flex items-center w-full gap-5 mb-10">
          <div className="relative w-full group">
            <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-blue-500 to-green-400 opacity-20 group-hover:duration-200 group-hover:opacity-100 blur" />
            <input
              className="relative w-full p-3 text-sm bg-white rounded-md focus:outline-none focus:ring focus:ring-primary-100"
              type="text"
              placeholder="Search patient..."
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <GradientCard>
            <button
              className="p-3"
              onClick={() => setCreatePatientCardVisible(1)}
              title="Create Patient"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M4.5 8.552c0 1.995 1.505 3.5 3.5 3.5s3.5-1.505 3.5-3.5-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5zM19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2z"
                ></path>
              </svg>
            </button>
          </GradientCard>
        </div>
        <CreatePatientCard
          show={createPatientCardVisible}
          setShow={setCreatePatientCardVisible}
        />

        {filterData?.length === 0 ? (
          <div>
            <div>Patient {searchValue} not found.</div>
          </div>
        ) : (
          <div className="w-full mb-10">
            <UpdateUserCard
              show={updatePatientCardVisible}
              setShow={setUpdatePatientCardVisible}
              data={updatePatientData}
              setData={setUpdatePatientData}
            />
            <div className="flex items-center justify-between w-full gap-3 py-1 mb-5">
              <div className="flex items-center w-full gap-3 px-2">
                {data?.patient && (
                  <input
                    className="w-5 h-5 transition duration-200 bg-white border border-gray-300 rounded-sm outline-none cursor-pointer checked:bg-blue-600 checked:border-blue-600 focus:outline-none"
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelect(filterData);
                      } else {
                        setSelect([]);
                      }
                    }}
                    checked={filterData?.length === select?.length}
                  />
                )}
                <div
                  onClick={() => {
                    router.reload();
                    toast.success("Data refreshed", {
                      duration: 5000,
                    });
                  }}
                  className="p-1 text-gray-400 rounded-md cursor-pointer hover:bg-gray-100 hover:text-gray-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                  >
                    <path
                      fill="currentColor"
                      d="M19.89 10.105a8.696 8.696 0 0 0-.789-1.456l-1.658 1.119a6.606 6.606 0 0 1 .987 2.345 6.659 6.659 0 0 1 0 2.648 6.495 6.495 0 0 1-.384 1.231 6.404 6.404 0 0 1-.603 1.112 6.654 6.654 0 0 1-1.776 1.775 6.606 6.606 0 0 1-2.343.987 6.734 6.734 0 0 1-2.646 0 6.55 6.55 0 0 1-3.317-1.788 6.605 6.605 0 0 1-1.408-2.088 6.613 6.613 0 0 1-.382-1.23 6.627 6.627 0 0 1 .382-3.877A6.551 6.551 0 0 1 7.36 8.797 6.628 6.628 0 0 1 9.446 7.39c.395-.167.81-.296 1.23-.382.107-.022.216-.032.324-.049V10l5-4-5-4v2.938a8.805 8.805 0 0 0-.725.111 8.512 8.512 0 0 0-3.063 1.29A8.566 8.566 0 0 0 4.11 16.77a8.535 8.535 0 0 0 1.835 2.724 8.614 8.614 0 0 0 2.721 1.833 8.55 8.55 0 0 0 5.061.499 8.576 8.576 0 0 0 6.162-5.056c.22-.52.389-1.061.5-1.608a8.643 8.643 0 0 0 0-3.45 8.684 8.684 0 0 0-.499-1.607z"
                    ></path>
                  </svg>
                </div>
                <div className="text-sm text-gray-500">
                  {filterData?.length ?? 0}{" "}
                  {filterData?.length === 0 || filterData?.length === 1
                    ? "patient"
                    : "patients"}
                </div>
              </div>
              <div className="flex items-center flex-shrink-0 gap-3">
                {select?.length !== 0 && (
                  <div className="text-sm ">
                    Export ({select?.length}) selected
                  </div>
                )}
                {select?.length === 0 ? (
                  <div>
                    <button
                      onClick={() => {}}
                      disabled={select?.length === 0}
                      className="flex items-center gap-2 px-3 py-1 text-sm border rounded-md disabled:text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:bg-gray-50"
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
                          d="M2.859 2.877l12.57-1.795a.5.5 0 0 1 .571.495v20.846a.5.5 0 0 1-.57.495L2.858 21.123a1 1 0 0 1-.859-.99V3.867a1 1 0 0 1 .859-.99zM4 4.735v14.53l10 1.429V3.306L4 4.735zM17 19h3V5h-3V3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4v-2zm-6.8-7l2.8 4h-2.4L9 13.714 7.4 16H5l2.8-4L5 8h2.4L9 10.286 10.6 8H13l-2.8 4z"
                        />
                      </svg>
                      <div>csv</div>
                    </button>
                  </div>
                ) : (
                  <CSVLink {...csv_report}>
                    <button
                      onClick={() => {}}
                      disabled={select?.length === 0}
                      className="flex items-center gap-2 px-3 py-1 text-sm border rounded-md disabled:text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:bg-gray-50"
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
                          d="M2.859 2.877l12.57-1.795a.5.5 0 0 1 .571.495v20.846a.5.5 0 0 1-.57.495L2.858 21.123a1 1 0 0 1-.859-.99V3.867a1 1 0 0 1 .859-.99zM4 4.735v14.53l10 1.429V3.306L4 4.735zM17 19h3V5h-3V3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4v-2zm-6.8-7l2.8 4h-2.4L9 13.714 7.4 16H5l2.8-4L5 8h2.4L9 10.286 10.6 8H13l-2.8 4z"
                        />
                      </svg>
                      <div>csv</div>
                    </button>
                  </CSVLink>
                )}
              </div>
            </div>
            <div className="w-full">
              {filterData?.map((d: Patient | any) => (
                <div
                  key={d?.id}
                  className={`flex items-center justify-between w-full px-2 py-2 mb-1 transition-all group hover:bg-gray-50 ${
                    select?.findIndex((a: User) => a?.id === d?.id) !== -1 &&
                    "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center w-full">
                    <input
                      className="w-5 h-5 mr-4 transition duration-200 bg-white border border-gray-300 rounded-sm outline-none cursor-pointer checked:bg-blue-600 checked:border-blue-600 focus:outline-none"
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelect([
                            ...select,
                            {
                              ...d,
                            },
                          ]);
                        } else {
                          setSelect(select.filter((s) => s?.id !== d?.id));
                        }
                      }}
                      checked={
                        select?.findIndex((a: any) => a?.id === d?.id) !== -1
                      }
                    />
                    <div className="flex items-center">
                      {d?.email}{" "}
                      {d?.user?.username && (
                        <div
                          className={`text-xs mx-2 py-1 px-4 whitespace-nowrap bg-pink-100 rounded-md`}
                        >
                          name: {d?.user?.username}
                        </div>
                      )}
                      <div
                        className={`text-xs mx-2 py-1 px-4 whitespace-nowrap bg-blue-100 rounded-md`}
                      >
                        ic: {d?.ic}
                      </div>
                      {d?.user?.state && (
                        <div
                          className={`text-xs mx-2 py-1 px-4 whitespace-nowrap bg-lime-100 rounded-md`}
                        >
                          {d?.user?.state.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      title={
                        d?.user && d?.user_id
                          ? "This patient already registered the account"
                          : "This patient hasn't register the account"
                      }
                      // onClick={() => {
                      //   setUpdateUserData({
                      //     id: d?.id,
                      //     email: d?.email,
                      //     type: String(d?.group),
                      //     ic: d?.ic,
                      //   });

                      //   setUpdateUserCardVisible(1);
                      // }}
                      className={`text-xs mx-1 py-1 px-4 ${
                        d?.user && d?.user_id ? "bg-green-200" : "bg-gray-200"
                      } rounded-md`}
                    >
                      {d?.user && d?.user_id ? "registered" : "unregistered"}
                    </div>
                    <button
                      disabled={!d?.user}
                      onClick={() => {
                        setUpdatePatientData({
                          id: d?.id,
                          email: d?.email,
                          type: String(d?.user.group),
                          ic: d?.ic,
                        });
                        setUpdatePatientCardVisible(1);
                      }}
                      className={`text-xs mx-1 py-1 px-4 bg-red-200 hover:bg-red-300 disabled:hover:bg-red-200 rounded-md`}
                    >
                      patient
                    </button>
                    {d?.user ? (
                      <Link href={`/admin/user/${d?.user?.id}`} passHref>
                        <a target="_blank" rel="noopener noreferrer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="text-gray-300 hover:text-gray-400"
                          >
                            <path
                              fill="currentColor"
                              d="M19.071 4.929c-3.899-3.898-10.243-3.898-14.143 0-3.898 3.899-3.898 10.244 0 14.143 3.899 3.898 10.243 3.898 14.143 0 3.899-3.9 3.899-10.244 0-14.143zm-3.536 10.607-2.828-2.829-3.535 3.536-1.414-1.414 3.535-3.536-2.828-2.829h7.07v7.072z"
                            ></path>
                          </svg>
                        </a>
                      </Link>
                    ) : (
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          className="text-gray-300"
                        >
                          <path
                            fill="currentColor"
                            d="M19.071 4.929c-3.899-3.898-10.243-3.898-14.143 0-3.898 3.899-3.898 10.244 0 14.143 3.899 3.898 10.243 3.898 14.143 0 3.899-3.9 3.899-10.244 0-14.143zm-3.536 10.607-2.828-2.829-3.535 3.536-1.414-1.414 3.535-3.536-2.828-2.829h7.07v7.072z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default User;

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   try {
//     const jwt = req.cookies.token;
//     const { payload } = await jwtVerify(
//       jwt,
//       new TextEncoder().encode(TOKEN_SECRET)
//     );

//     const admin = await prisma.admin.findUnique({
//       where: {
//         // @ts-ignore
//         email: payload?.email,
//       },
//     });
//     if (!admin) {
//       throw new Error("");
//     }
//     if (admin.type === "admin") {
//       return {
//         redirect: {
//           permanent: true,
//           destination: "/admin",
//         },
//       };
//     }
//     const admins = await prisma.admin.findMany({
//       select: {
//         id: true,
//         email: true,
//         type: true,
//       },
//       orderBy: {
//         type: "desc",
//       },
//     });
//     return {
//       props: { admin: admins, email: payload?.email },
//     };
//   } catch (error) {
//     return {
//       redirect: {
//         permanent: true,
//         destination: "/admin",
//       },
//     };
//   }
// };
