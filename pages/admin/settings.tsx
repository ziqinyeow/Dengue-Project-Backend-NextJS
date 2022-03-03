import Container from "components/Container";
import type { NextPage } from "next";
import useData from "contexts/data";

const Settings: NextPage = () => {
  const { data } = useData();

  return (
    <Container title="Settings">
      <div className="layout">
        <h2 className="mb-8">Settings</h2>
      </div>
    </Container>
  );
};

export default Settings;

// export const getServerSideProps: GetServerSideProps = async () => {
//   const question: User[] = await prisma.user.findMany();

//   return {
//     props: { question },
//   };
// };
