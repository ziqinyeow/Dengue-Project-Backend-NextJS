import { useRouter } from "next/router";
import { createContext, useContext, useState } from "react";

type Data = {
  user: [];
  detail: [];
  type: "";
  admin: [];
  message: "";
};

const initial_state = {
  data: {
    user: [],
    detail: [],
    type: "",
    admin: [],
    message: "",
  },
  getData: () => {},
};

const dataContext = createContext(initial_state);

export default function useData() {
  return useContext(dataContext);
}

export function DataContext(props: any) {
  const router = useRouter();
  const [data, setData] = useState<Data>();

  const getData = async () => {
    if (data?.user) {
      return;
    }
    try {
      const fetcher = await fetch("/api/admin/private");
      const data = await fetcher.json();

      setData(data);
    } catch (error) {
      console.log("error");

      // router.push("login");
    }
  };

  const value = { data, getData };

  return <dataContext.Provider value={value} {...props} />;
}
