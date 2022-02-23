import NextLink from "next/link";
import { useRouter } from "next/router";
import cn from "classnames";
import { motion } from "framer-motion";

export type NavItem = {
  href: string;
  children: React.ReactNode;
  logo?: boolean;
};

const variants = {
  initial: {
    opacity: 0,
    scale: 0,
    scaleX: 0,
    ease: "easeOut",
    duration: 0.1,
    type: "tween",
  },
  hover: {
    opacity: 1,
    scale: 1,
    scaleX: 1,
    transition: {
      duration: 0.2,
      type: "tween",
      ease: "easeIn",
    },
  },
};

const NavItem: React.FC<NavItem> = ({ href, children, logo }) => {
  const router = useRouter();
  const isActive = router.asPath === href;
  return (
    <NextLink href={href} passHref>
      <a
        className={cn(
          "p-3 w-full relative transition-all flex justify-center items-center",
          isActive ? "text-blue-700" : "text-gray-500 hover:text-gray-600"
        )}
      >
        <div>{children}</div>
        {isActive && !logo && (
          <div className="absolute top-0 w-[70%] h-full transform -rotate-90 -right-[2.35rem]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="currentColor"
                fillOpacity="1"
                d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        )}
      </a>
    </NextLink>
  );
};

export default NavItem;
