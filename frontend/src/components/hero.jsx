import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "./navbar";
import { navItems } from "../../data";
import CustomButton from "./customButton";
import Social from "./social";

const Hero = () => {
  const boxRef = useRef(null);

  useGSAP(() => {
    gsap.to(boxRef.current, {
      scrollTrigger:boxRef.current,
      x: 20,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power2.out',
    });
  }, []);

  return (
    <div className="bg-[#12141d] p-4 m-2 rounded-lg max-sm:rounded-sm text-white md:space-y-10">
      <Navbar navItems={navItems} heading={"linkup"} />
      <div className="grid grid-cols-2 grid-rows-1 items-center justify-center max-md:grid-cols-1 md:w-[80%] m-auto">
        <div className="first-letter:uppercase p-3 space-y-5 max-lg:space-y-2 self-center flex flex-col max-md:items-center">
          <h1 className="lg:text-[2.5rem] max-lg:text-[1.5rem] max-md:text-center tracking-widest uppercase font-bold">
            <span className="text-[#3EE4CA]">connect</span> instantly with other
          </h1>
          <p className="tracking-widest max-md:text-center max-md:text-[0.7rem] font-bold max-lg:text-[0.7rem]">
            Experience seamless, user-friendly messaging that brings together
            effortlessly
          </p>
          <Social navItems={navItems} />
          <p className="tracking-widest max-md:text-center text-[0.7rem]">
            <span className="text-[#3EE4CA] font-bold">*important</span> Please select two test accounts on two different devices or browsers
          </p>
          <div className="flex gap-4 flex-col lg:flex-row max-sm:gap-1">
            <CustomButton name={"test account 1"}/>
            <CustomButton name={"test account 2"}/>
          </div>
        </div>
        <div className="justify-self-center">
          <img ref={boxRef} src="hero.png" alt="" className="max-md:w-64 max-md:h-64" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
