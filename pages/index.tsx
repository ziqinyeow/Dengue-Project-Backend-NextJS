import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/login");
  }, [router]);
  return <div></div>;
};

export default Index;
