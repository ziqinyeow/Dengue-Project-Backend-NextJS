import { useEffect } from "react";
import useData from "contexts/data";
import Head from "next/head";
import { useRouter } from "next/router";
import NavItem from "./NavItem";
import toast from "react-hot-toast";

const Container = (props: any) => {
  const router = useRouter();
  const { data, isData, getData, removeData } = useData();
  const { children, ...customMeta } = props;
  const meta = {
    title: "Admin",
    description: `Dengue API`,
    // image: "https://.io/static/images/banner.png",
    type: "website",
    ...customMeta,
  };
  useEffect(() => {
    const get = async () => {
      await getData();
    };
    const ready = isData();
    if (!ready) {
      get();
      // toast.promise(get(), {
      //   loading: "loading...",
      //   success: "data loaded",
      //   error: "data not load",
      // });
    }
  });

  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="Dengue API" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        {meta.date && (
          <meta property="article:published_time" content={meta.date} />
        )}
      </Head>
      <div className="h-[100vh] grid sidebar">
        <div className="w-[80px]" />
        <nav className="fixed z-50 w-[80px] border-r h-[100vh] flex flex-col items-center justify-between py-5">
          <div>
            <div className="pb-5 mb-5 border-b">
              <NavItem href="/admin" logo={true}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  className="text-blue-600"
                >
                  <path
                    fill="currentColor"
                    d="M13 6c2.507.423 4.577 2.493 5 5h4c-.471-4.717-4.283-8.529-9-9v4z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M18 13c-.478 2.833-2.982 4.949-5.949 4.949-3.309 0-6-2.691-6-6C6.051 8.982 8.167 6.478 11 6V2c-5.046.504-8.949 4.773-8.949 9.949 0 5.514 4.486 10 10 10 5.176 0 9.445-3.903 9.949-8.949h-4z"
                  ></path>
                </svg>
              </NavItem>
            </div>
            <div className="w-full space-y-4">
              <NavItem href="/admin">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    fill="currentColor"
                    d="M5 22h14a2 2 0 0 0 2-2v-9a1 1 0 0 0-.29-.71l-8-8a1 1 0 0 0-1.41 0l-8 8A1 1 0 0 0 3 11v9a2 2 0 0 0 2 2zm5-2v-5h4v5zm-5-8.59 7-7 7 7V20h-3v-5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v5H5z"
                  ></path>
                </svg>
              </NavItem>
              <NavItem href="/admin/user">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    fill="currentColor"
                    d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"
                  ></path>
                </svg>
              </NavItem>
              <NavItem href="/admin/patient">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 10c1.151 0 2-.848 2-2s-.849-2-2-2c-1.15 0-2 .848-2 2s.85 2 2 2zm0 1c-2.209 0-4 1.612-4 3.6v.386h8V14.6c0-1.988-1.791-3.6-4-3.6z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M19 2H5c-1.103 0-2 .897-2 2v13c0 1.103.897 2 2 2h4l3 3 3-3h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm-5 15-2 2-2-2H5V4h14l.002 13H14z"
                  ></path>
                </svg>
              </NavItem>
              <NavItem href="/admin/quiz">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M19 10H5c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2zM5 20v-8h14l.002 8H5zM5 6h14v2H5zm2-4h10v2H7z"
                  ></path>
                </svg>
              </NavItem>
            </div>
          </div>
          <div className="space-y-3">
            {data?.type === "superuser" && (
              <NavItem href="/admin/dashboard" logo={true}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M15 11h7v2h-7zm1 4h6v2h-6zm-2-8h8v2h-8zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2zm4-7c1.995 0 3.5-1.505 3.5-3.5S9.995 5 8 5 4.5 6.505 4.5 8.5 6.005 12 8 12z"
                  ></path>
                </svg>
              </NavItem>
            )}
            <NavItem href="/admin/settings" logo={true}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 16c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.084 0 2 .916 2 2s-.916 2-2 2-2-.916-2-2 .916-2 2-2z"
                ></path>
                <path
                  fill="currentColor"
                  d="m2.845 16.136 1 1.73c.531.917 1.809 1.261 2.73.73l.529-.306A8.1 8.1 0 0 0 9 19.402V20c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2v-.598a8.132 8.132 0 0 0 1.896-1.111l.529.306c.923.53 2.198.188 2.731-.731l.999-1.729a2.001 2.001 0 0 0-.731-2.732l-.505-.292a7.718 7.718 0 0 0 0-2.224l.505-.292a2.002 2.002 0 0 0 .731-2.732l-.999-1.729c-.531-.92-1.808-1.265-2.731-.732l-.529.306A8.1 8.1 0 0 0 15 4.598V4c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.598a8.132 8.132 0 0 0-1.896 1.111l-.529-.306c-.924-.531-2.2-.187-2.731.732l-.999 1.729a2.001 2.001 0 0 0 .731 2.732l.505.292a7.683 7.683 0 0 0 0 2.223l-.505.292a2.003 2.003 0 0 0-.731 2.733zm3.326-2.758A5.703 5.703 0 0 1 6 12c0-.462.058-.926.17-1.378a.999.999 0 0 0-.47-1.108l-1.123-.65.998-1.729 1.145.662a.997.997 0 0 0 1.188-.142 6.071 6.071 0 0 1 2.384-1.399A1 1 0 0 0 11 5.3V4h2v1.3a1 1 0 0 0 .708.956 6.083 6.083 0 0 1 2.384 1.399.999.999 0 0 0 1.188.142l1.144-.661 1 1.729-1.124.649a1 1 0 0 0-.47 1.108c.112.452.17.916.17 1.378 0 .461-.058.925-.171 1.378a1 1 0 0 0 .471 1.108l1.123.649-.998 1.729-1.145-.661a.996.996 0 0 0-1.188.142 6.071 6.071 0 0 1-2.384 1.399A1 1 0 0 0 13 18.7l.002 1.3H11v-1.3a1 1 0 0 0-.708-.956 6.083 6.083 0 0 1-2.384-1.399.992.992 0 0 0-1.188-.141l-1.144.662-1-1.729 1.124-.651a1 1 0 0 0 .471-1.108z"
                ></path>
              </svg>
            </NavItem>
            <div
              onClick={async () => {
                try {
                  const fetcher = await fetch("/api/admin/logout");

                  if (fetcher.ok) {
                    removeData();
                    router.push("/login");
                  }
                } catch (error) {
                  removeData();
                  router.push("/login");
                }
              }}
            >
              <NavItem href="/" logo={true}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M16 13v-2H7V8l-5 4 5 4v-3z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"
                  ></path>
                </svg>
              </NavItem>
            </div>
          </div>
        </nav>
        <main className="w-full h-full mb-10">{children}</main>
      </div>
    </div>
  );
};

export default Container;
