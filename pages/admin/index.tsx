import Container from "components/Container";
import useSWR from "swr";
import type { GetServerSideProps, NextPage } from "next";
import { prisma } from "lib/prisma";
import { User } from "@prisma/client";
import fetcher from "lib/fetcher";
import GradientCard from "components/GradientCard";

const Home: NextPage = () => {
  const { data }: any = useSWR("/api/admin/metrics", fetcher);

  return (
    <Container title="Admin">
      <div className="layout">
        <h2 className="mb-8">Home</h2>
        <div className="grid w-full gap-5 lg:grid-cols-3">
          <GradientCard className="p-5">
            <h4 className="mb-2">Total User</h4>
            <h2>{data?.total_user ?? "--"}</h2>
          </GradientCard>
          <GradientCard className="p-5">
            <h4 className="mb-2">Total Patient</h4>
            <h2>{data?.total_patient ?? "--"}</h2>
          </GradientCard>
          <GradientCard className="p-5">
            <h4 className="mb-2">Total Medical Record</h4>
            <h2>{data?.total_detail ?? "--"}</h2>
          </GradientCard>
        </div>
      </div>
    </Container>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const question: User[] = await prisma.user.findMany();

  return {
    props: { question },
  };
};
