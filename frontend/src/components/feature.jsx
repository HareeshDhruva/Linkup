import React, { useRef, useEffect } from "react";
import { featureData } from "../../data";
import gsap from "gsap";

const Feature = () => {
  const featureRefs = useRef([]);
  
  useEffect(() => {
    featureRefs.current = featureRefs.current.slice(0, featureData.length);
  }, [featureData.length]);

  const handleScroll = () => {
    featureRefs.current.forEach((ref) => {
      const element = ref.current;
      if (element) {
        const topOffset = element.getBoundingClientRect().top;
        const scrollTrigger = window.innerHeight * 0.7; 

        if (topOffset < scrollTrigger) {
          gsap.to(element, {
            scrollTrigger:{
              scrub:1,
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out",
          },
        );
        }
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);



  return (
    <div className="w-[80%] max-md:w-[90%] m-auto space-y-20 text-black">
      <h1 className="text-center uppercase text-[2.5rem] max-md:my-6 my-12 font-bold text-[#12141d] max-md:text-[1.5rem]">
        feature
      </h1>
      <div className="lg:flex gap-5 justify-center max-md:flex-col max-md:text-[0.7rem] text-[.9rem] grid max-lg:grid-cols-2 max-lg:grid-rows-2 max-lg:gap-4 max-sm:grid-cols-1 grid-cols-4">
        {featureData.map((data, index) => {
          const itemRef = useRef(null);
          featureRefs.current[index] = itemRef;
          return (
            <div
              key={index}
              ref={itemRef}
              className="w-[300px] m-auto flex flex-col items-center p-4 justify-center shadow-lg bg-[#3EE4CA] rounded-lg max-sm:rounded-sm"
              style={{ opacity: 0, transform: "translateY(50px)" }}
            >
              <img src={data.image} alt="" className="w-20 h-20" />
              <p className="max-md:w-full rounded-lg p-2 text-start flex text-balance items-center">
                {data.data}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Feature;
