import React, { useState,useRef } from "react";
import CustomButton from "./customButton";
import { TiThMenu } from "react-icons/ti";
import Signin from "./signin";
import { RxCross2 } from "react-icons/rx";
import { useAuthContext } from "../context/authContextProvider";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Navbar = ({ navItems, heading }) => {
  const { authUser } = useAuthContext();
  const [open, setOpen] = useState(false);
  const mobileNav = useRef();

  useGSAP(() => {
    gsap.from(mobileNav.current, { y: -100, opacity: 0, duration: 0.5, delay: 0.2 });
    gsap.to(mobileNav.current, { y: 0, opacity: 1, duration: 0.5, delay: 0.2 });
  },[open === true]);

  return (
    <div>
      {/* mobile navbar */}
      <div ref={mobileNav} className={`bg-black fixed left-0 text-center rounded-sm top-0 z-20 w-full md:hidden bg-opacity-60 backdrop-blur-lg ${open ? "visible":"hidden"} border-b-2`}>
      <div className="fixed top-5 right-10 w-[40px] h-[40px] flex justify-center items-center rounded-full cursor-pointer z-10">
          <RxCross2 onClick={()=>setOpen(false)} className="text-white" />
        </div>
          <ul className="flex justify-start items-center flex-col my-4 gap-5 md:hidden">
          {navItems.map((items, index) => (
            <Link to={`/${items}`} key={index}>
              <li className="first-letter:uppercase w-[100%] py-1 px-4 hover:rounded-full text-center hover:bg-[#3EE4CA] hover:text-black text-[0.7rem]">
                {items}
              </li>
            </Link>
          ))}
        </ul>
        <div className="flex gap-5 items-center justify-center md:hidden mb-8">
          {authUser === null ? (
            <>
              <CustomButton name={"Login"} />
              <CustomButton name={"Sign up"} />
            </>
          ) : (
            <CustomButton name={"Logout"} />
          )}
        </div>
      </div>
       {/* mobile navbar */}

      <div className="flex justify-between items-center md:w-[80%] text-white m-auto md:py-5">
        <div className="flex items-center justify-center gap-3">
          <img src="chat.png" alt="" className="w-10 h-10" />
          <p className="first-letter:uppercase font-bold text-3xl text-[#3EE4CA]">
            {heading}
          </p>
        </div>
        <ul className="flex justify-center items-center gap-5 max-md:hidden">
          {navItems.map((items, index) => (
            <Link to={`/${items}`} key={index}>
              <li className="first-letter:uppercase max-lg:text-[0.7rem] cursor-pointer">
                {items}
              </li>
            </Link>
          ))}
        </ul>
        <div className="flex gap-5 items-center max-md:hidden">
          {authUser === null ? (
            <>
              <CustomButton name={"Login"} />
              <CustomButton name={"Sign up"} />
            </>
          ) : (
            <CustomButton name={"Logout"} />
          )}
        </div>
        <TiThMenu className="md:hidden text-[1.5rem]"  onClick={()=>setOpen(true)}/>
        <Signin />
      </div>
    </div>
  );
};

export default Navbar;
