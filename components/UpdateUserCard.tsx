import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
// import { storage } from "../lib/firebase/config";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UpdateUserCard = ({ show, setShow, data, setData }: any) => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [userType, setUserType] = useState("user");

  const [uploading, setUploading] = useState(false);

  const change = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value }: any = e.target;
    // @ts-ignore
    setForm({
      ...form,
      [name]: value,
    });
  };

  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setUploading(true);
    if (userType === data?.type) {
      setUploading(false);
      setShow(0);
    }
    try {
      const fetcher = await fetch("/api/admin/private/user", {
        method: "PUT",
        body: JSON.stringify({
          id: data?.id,
          group: userType,
          email: data?.email,
          phone_no: data?.phone_no,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUploading(false);
      if (fetcher.ok) {
      } else {
        throw new Error("");
      }
    } catch (error) {
      throw new Error("");
    }
    router.reload();
  };

  useEffect(() => {
    setUserType(data?.type);
  }, [data?.type]);

  return (
    <div>
      {show !== 0 && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full py-5 bg-gray-200 bg-opacity-50">
          <div className="relative w-full max-w-3xl max-h-full px-10 py-10 mx-auto overflow-y-auto text-black bg-white rounded-lg shadow-2xl no_scrollbar 2xl:max-w-5xl">
            <h3 className="mb-5 font-bold">Edit User Role</h3>
            <button
              disabled={uploading}
              type="button"
              onClick={() => {
                setData({});
                setShow(0);
              }}
              className="absolute p-1 text-black transition-all duration-300 rounded-md top-2 right-2 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"
                />
              </svg>
            </button>
            <form
              onSubmit={(e) => {
                toast.promise(submit(e), {
                  loading: "Updating user",
                  success: "Updated",
                  error: "Cannot update",
                });
              }}
            >
              <h5 className="mb-2 font-semibold">Email</h5>
              <input
                type="email"
                placeholder="tim@apple.com"
                className="w-full px-4 py-2 mb-8 bg-white border rounded-md disabled:text-gray-400 disabled:bg-gray-200/50 focus:outline-none focus:border-gray-400"
                name="email"
                value={data?.email}
                onChange={change}
                required
                autoComplete="off"
                disabled
              />
              <h5 className="mb-2 font-semibold">Password</h5>
              <input
                type="password"
                placeholder="..."
                className="w-full px-4 py-2 mb-8 bg-white border rounded-md disabled:text-gray-400 disabled:bg-gray-200/50 focus:outline-none focus:border-gray-400"
                name="password"
                value={data?.password}
                onChange={change}
                disabled
                required
                autoComplete="off"
              />
              <div className="grid w-full grid-cols-2 gap-5 mb-8">
                <div
                  onClick={() => setUserType("user")}
                  className={`flex items-center justify-center py-2 border cursor-pointer rounded-md ${
                    userType === "user" && "border-gray-500"
                  }`}
                >
                  User
                </div>
                <div
                  onClick={() => setUserType("patient")}
                  className={`flex items-center justify-center py-2 border cursor-pointer rounded-md ${
                    userType === "patient" && "border-gray-500"
                  }`}
                >
                  Patient
                </div>
              </div>

              <div className="flex justify-end w-full gap-5 mt-8">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 font-medium text-white transition-all duration-150 bg-black border-2 border-black rounded-md disabled:bg-opacity-10 disabled:border-0 disabled:hover:bg-black disabled:hover:bg-opacity-10 disabled:bg-black disabled:text-white disabled:hover:text-white hover:bg-white hover:text-black"
                >
                  Update
                </button>
                <button
                  type="button"
                  disabled={uploading}
                  className="px-5 py-2 font-medium text-red-500 transition-all duration-150 bg-white border-2 border-red-500 rounded-md disabled:bg-opacity-10 disabled:border-0 disabled:hover:bg-black disabled:hover:bg-opacity-10 disabled:bg-black disabled:text-white disabled:hover:text-white hover:bg-red-500 hover:text-white"
                  onClick={() => {
                    setData({});
                    setShow(0);
                  }}
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateUserCard;
