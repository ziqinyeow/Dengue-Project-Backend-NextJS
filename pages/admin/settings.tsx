import Container from "components/Container";
import type { NextPage } from "next";
import useData from "contexts/data";

const Settings: NextPage = () => {
  const { data } = useData();
  console.log(data);

  return (
    <Container title="Settings">
      <div className="layout">
        <h2 className="mb-8">Settings</h2>
        <h3 className="mb-8 font-bold text-gray-400">Profile</h3>
        <div className="w-full pb-8 mb-10 border-b">
          <div className="flex items-center">
            <h4 className="mb-5 mr-3">Email:</h4>
            <h4 className="mb-5">
              {
                // @ts-ignore
                data?.admin?.email ?? "--"
              }
            </h4>
          </div>
          <div className="flex items-center">
            <h4 className="mb-5 mr-3">Type:</h4>
            <h4 className="mb-5">
              {
                // @ts-ignore
                data?.admin?.type ?? "--"
              }
            </h4>
          </div>
        </div>
        <h3 className="mb-8 font-bold text-gray-400">Change Password</h3>
        <form className="w-full pb-8 mb-10">
          <div className="flex items-center mb-5">
            <h4 className="mr-3 whitespace-nowrap">Old Password:</h4>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex items-center mb-5">
            <h4 className="mr-3 whitespace-nowrap">New Password:</h4>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 mt-10 text-sm font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700"
          >
            Change password
          </button>
        </form>
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
