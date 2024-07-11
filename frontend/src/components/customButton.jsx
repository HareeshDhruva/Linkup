import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useConversation from "../zustand/useConversation";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authContextProvider";
import axios from "axios";

const CustomButton = ({ name }) => {
  const box = useRef();
  const container = useRef();
  const navigation = useNavigate();
  const { setAuthUser } = useAuthContext();
  const { setOpenSignin, setOpenRegister } =
    useConversation();

  useGSAP(
    () => {
      gsap.from(box.current, { scale: 0, delay: 1, opacity: 0 });
    },
    { scope: container }
  );

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/auth/logout`, "", {
        withCredentials: true,
      });
      if (response.status === 200) {
        localStorage.setItem("user", null);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const handleSubmitLogin = async (data) => {
    try {
      const response = await axios.post(`/api/auth/login`,data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const userData = response.data.data;
        localStorage.setItem("user", null);
        localStorage.setItem("user", JSON.stringify(userData));
        setAuthUser(userData);
        navigation("/message");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  useEffect(() => {
    setOpenSignin(false);
    setOpenRegister(false);
  }, []);

  const onClickHandle = () => {
    if (name === "Login") {
      setOpenSignin(true);
      setOpenRegister(false);
    } else if (name === "Sign up") {
      setOpenRegister(true);
      setOpenSignin(false);
    } else if (name === "Logout") {
      handleSubmit();
    } else if (name === "test account 1") {
      handleSubmitLogin({
        email: "admin@gmail.com",
        password: "password",
      });
    }
    else if (name === "test account 2") {
      handleSubmitLogin({
        email: "test@gmail.com",
        password: "password",
      });
    }
    else {
      setOpenSignin(false);
      setOpenRegister(false);
    }
  };

  return (
    <div ref={container}>
      <input
        type="button"
        ref={box}
        value={name}
        className={`py-2 px-5 max-sm:py-1 rounded-3xl text-[0.7rem] ${
          name !== "Login"
            ? "bg-[#3EE4CA] text-[#12141d]"
            : "ring-1 ring-[#3EE4CA] text-white bg-[#12141d] "
        }`}
        onClick={onClickHandle}
      />
    </div>
  );
};

export default CustomButton;
