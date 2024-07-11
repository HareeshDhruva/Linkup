import React from "react";
import { alternativeData } from "../../data";

const Alternatives = () => {
  return (
    <div className="w-[80%] m-auto my-10 items-center gap-5 text-black">
      {alternativeData.map((data, index) => (
        <div key={index} className={`flex items-center gap-5 max-md:flex-col max-md:text-[0.7rem] max-lg:text-[0.8rem] text-[0.9rem]" ${index%2 === 0 && "flex-row-reverse"}`}>
          <div>
            <img src={data.image} alt="" className="" />
          </div>
          <div className="p-2">
            <p>{data.data}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Alternatives;
