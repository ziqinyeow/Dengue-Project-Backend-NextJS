import { useRouter } from "next/router";
import { createContext, useContext, useState } from "react";

type Data = {
  user: [];
  patient: [];
  detail: [];
  type: "";
  admin: [];
  message: "";
};

const initial_state = {
  data: {
    user: [],
    patient: [],
    detail: [],
    type: "",
    admin: [],
    message: "",
  },
  isData: () => false,
  getData: () => {},
  removeData: () => {},
};

const dataContext = createContext(initial_state);

export default function useData() {
  return useContext(dataContext);
}

export function DataContext(props: any) {
  const router = useRouter();
  const [data, setData] = useState<Data>();

  const isData = () => {
    if (data?.user?.length !== 0 && data?.type) {
      return true;
    } else {
      return false;
    }
  };

  const getData = async () => {
    if (isData()) {
      return;
    }
    try {
      const fetcher = await fetch("/api/admin/private");
      const data = await fetcher.json();
      setData(data);
    } catch (error) {
      // console.log("error");
      // router.push("login");
    }
  };

  // logout
  const removeData = () => {
    setData({
      user: [],
      patient: [],
      detail: [],
      type: "",
      admin: [],
      message: "",
    });
  };

  const value = { data, getData, removeData, isData };

  return <dataContext.Provider value={value} {...props} />;
}
