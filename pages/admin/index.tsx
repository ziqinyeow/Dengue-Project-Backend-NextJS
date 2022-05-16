import Container from "components/Container";
import useSWR from "swr";
import type { NextPage } from "next";
import fetcher from "lib/fetcher";
import GradientCard from "components/GradientCard";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: metrics }: any = useSWR("/api/admin/private/metrics", fetcher);

  return (
    <Container title="Admin">
      <div className="layout">
        <h2 className="mb-8">Home</h2>
        <div className="grid w-full gap-5 lg:grid-cols-2">
          <Link href="/admin/user">
            <a>
              <GradientCard className="p-5">
                <h4 className="mb-2">
                  Total <b>User</b>
                </h4>
                <h2>{metrics?.total_user ?? "--"}</h2>
              </GradientCard>
            </a>
          </Link>
          <Link href="/admin/patient">
            <a>
              <GradientCard className="p-5">
                <h4 className="mb-2">
                  Total <b>Patient</b>
                </h4>
                <h2>{metrics?.total_patient ?? "--"}</h2>
              </GradientCard>
            </a>
          </Link>
          <Link href="/admin/vital_sign">
            <a>
              <GradientCard className="p-5">
                <h4 className="mb-2">
                  Total <b>Vital Sign</b>
                </h4>
                <h2>{metrics?.total_vital_sign ?? "--"}</h2>
              </GradientCard>
            </a>
          </Link>
          <Link href="/admin/blood_profile">
            <a>
              <GradientCard className="p-5">
                <h4 className="mb-2">
                  Total <b>Blood Profile</b>
                </h4>
                <h2>{metrics?.total_blood_profile ?? "--"}</h2>
              </GradientCard>
            </a>
          </Link>
          <Link href="/admin/history">
            <a>
              <GradientCard className="p-5">
                <h4 className="mb-2">
                  Total <b>History</b>
                </h4>
                <h2>{metrics?.total_history ?? "--"}</h2>
              </GradientCard>
            </a>
          </Link>
          <Link href="/admin/seek_help_form">
            <a>
              <GradientCard className="p-5">
                <h4 className="mb-2">
                  Total <b>Seek Help Form</b>
                </h4>
                <h2>{metrics?.total_seek_help_form ?? "--"}</h2>
              </GradientCard>
            </a>
          </Link>
          <Link href="/admin/symptom">
            <a>
              <GradientCard className="p-5">
                <h4 className="mb-2">
                  Total <b>Symptom</b>
                </h4>
                <h2>{metrics?.total_symptom ?? "--"}</h2>
              </GradientCard>
            </a>
          </Link>
          <Link href="/admin/answer">
            <a>
              <GradientCard className="p-5">
                <h4 className="mb-2">
                  Total <b>Answer</b>
                </h4>
                <h2>{metrics?.total_answer ?? "--"}</h2>
              </GradientCard>
            </a>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Home;

// export const getServerSideProps: GetServerSideProps = async () => {
//   const question: User[] = await prisma.user.findMany();

//   return {
//     props: { question },
//   };
// };
