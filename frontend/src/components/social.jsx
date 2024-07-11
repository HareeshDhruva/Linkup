import React from "react";
import { TiSocialFacebook } from "react-icons/ti";
import { FaGithub } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { AiFillTwitterCircle } from "react-icons/ai";
import { TiSocialLinkedin } from "react-icons/ti";
import { Link } from "react-router-dom";
import { info } from "../../data";

const Social = () => {
  return (
    <div className="p-2">
      <div className="text-[40px] max-lg:text-[20px] flex gap-5">
        <div className="rounded-full ring-2 ring-[#3EE4CA] text-[#3EE4CA] p-1">
          <Link to={info.facebook}>
            <TiSocialFacebook />
          </Link>
        </div>
        <div className="rounded-full ring-2 ring-[#3EE4CA] text-[#3EE4CA] p-1">
          <Link to={info.insta}>
            <RiInstagramFill />
          </Link>
        </div>
        <div className="rounded-full ring-2 ring-[#3EE4CA] text-[#3EE4CA] p-1">
          <Link to={info.twitter}>
            <AiFillTwitterCircle />
          </Link>
        </div>
        <div className="rounded-full ring-2 ring-[#3EE4CA] text-[#3EE4CA] p-1">
          <Link to={info.linkedin}>
            <TiSocialLinkedin />
          </Link>
        </div>
        <div className="rounded-full ring-2 ring-[#3EE4CA] text-[#3EE4CA] p-1">
          <Link to={info.github}>
            <FaGithub />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Social;
