import toast from "react-hot-toast";

const UserInfo = ({
  title,
  content,
}: {
  title: string;
  content: string | any;
}) => {
  return (
    <div className="relative flex items-center justify-between mb-3 overflow-hidden group whitespace-nowrap text-ellipsis">
      <h5
        onClick={() => {
          toast.success(`${title} Copied`);
          navigator.clipboard.writeText(content);
        }}
        className="mr-3 font-medium cursor-pointer group-hover:underline"
      >
        {title}
      </h5>
      <h5
        onClick={() => {
          toast.success(`${title} Copied`);
          navigator.clipboard.writeText(content);
        }}
        className="cursor-pointer group-hover:underline"
      >
        {content ?? "--"}
      </h5>
    </div>
  );
};

export default UserInfo;
