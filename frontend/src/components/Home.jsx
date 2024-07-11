import { useState, useEffect, useRef } from "react";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authContextProvider.jsx";
import useGetConversation from "../hooks/useGetConversation.js";
import { useSocketContext } from "../context/socketContext.jsx";
import useListernMessage from "../hooks/useListernMessage.js";
import useConversation from "../zustand/useConversation.js";
import useSendMessage from "../hooks/useSendMessage.js";
import useGetMessages from "../hooks/useGetMessages.js";
import { RxCross2 } from "react-icons/rx";
import { TiThMenu } from "react-icons/ti";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Home = () => {
  const { conversation } = useGetConversation();
  const [currentMessage, setCurrentMessage] = useState();
  const { selectedConversation, setSelectedConversation, messages } = useConversation();
  const bottomRef = useRef(null);
  const { authUser } = useAuthContext();
  const { onlineUsers } = useSocketContext();
  const { sendMessage } = useSendMessage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const selectUSer = (data) => {
    setSelectedConversation(data);
    setOpen(false);
  };

  const dateConvert = (isoDate) => {
    const date = new Date(isoDate);
    const formattedDate = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedDate;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentMessage.trim()) {
        sendMessage(currentMessage);
        setCurrentMessage("");
      }
    }
  };

  const handleSubmitMessage = () => {
    if (currentMessage.trim()) {
      sendMessage(currentMessage);
      setCurrentMessage("");
    }
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  useGetMessages();
  useListernMessage();

  // aimation

  const mobileMenu = useRef();
  useGSAP(() => {
    gsap.from(mobileMenu.current, { x: -100, opacity: 0,});
    gsap.to(mobileMenu.current, { x: 0, opacity: 1,});
  },[open === true]);

  useEffect(() => {
    if (!conversation) return;
    const tl = gsap.timeline({ paused: true });
    conversation.forEach((friend, index) => {
      tl.fromTo(
        `.conversation-item-${index}`,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.1,}
      );
    });
    tl.play();
    return () => {
      tl.kill();
    };
  }, [open === true]);
  if (!conversation) return null;

  return (
    <div className="grid grid-cols-4 overflow-hidden">
      {/* left start */}
      <div className="h-[100dvh] col-span-1  bg-[#3EE4CA] max-sm:hidden">
        <div className="m-2 flex flex-col gap-5">
          <div>
            <p className="text-[#12141d] md:p-2 text-[1rem] max-md:text-[0.5rem] text-center font-bold m-1 uppercase">
              connections
            </p>
            <div className="h-[92dvh] overflow-y-scroll m-2 text-[0.7rem] containe">
              <div className="p-1 text-center font-bold">
                <div>
                  {conversation?.map((friend, index) => (
                    <div
                      className={`flex md:gap-2 text-center m-1 conversation-item conversation-item-${index} ${
                        selectedConversation?._id === friend._id
                          ? "sm:bg-[#12141d] text-[#fff]"
                          : "sm:bg-white text-black"
                      } items-center p-1 rounded-3xl justify-between`}
                      key={index}
                      onClick={() => selectUSer(friend)}
                    >
                      <div className="flex md:gap-5 items-center ">
                        {friend.profilePhoto.url ? (
                          <img
                            className="ring-1 ring-gray-500 rounded-full w-10"
                            src={friend.profilePhoto.url}
                          />
                        ) : (
                          <img
                            className="ring-1 ring-gray-500 rounded-full w-10"
                            src="avatar.svg"
                          />
                        )}
                        <p className="max-md:hidden">{friend.fullname}</p>
                      </div>
                      <div className="sm:mr-4 max-sm:hidden">
                        <p className="">
                          {onlineUsers?.includes(friend._id) ? (
                            <span className="relative flex h-3 w-3">
                              <span
                                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                                  selectedConversation?._id === friend._id
                                    ? "bg-white"
                                    : "bg-[#12141d]"
                                }  opacity-75`}
                              ></span>
                              <span
                                className={`relative inline-flex rounded-full h-3 w-3 ${
                                  selectedConversation?._id === friend._id
                                    ? "bg-white"
                                    : "bg-[#12141d]"
                                }`}
                              ></span>
                            </span>
                          ) : (
                            ""
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`bg-black fixed left-0 text-center rounded-sm top-0 z-20 w-[70%] md:hidden bg-opacity-60 backdrop-blur-lg border-r-2 ${
          open ? "visible" : "hidden"
        }`}
      >
        <div className="fixed top-2 right-5 w-[40px] h-[40px] flex justify-center items-center rounded-full cursor-pointer z-10">
          <RxCross2 onClick={() => setOpen(false)} className="text-white" />
        </div>
        {/* mobile view */}
        <div className="h-[100dvh] col-span-1" >
          <div className="flex flex-col gap-5">
            <div>
              <div className="h-[92dvh] overflow-y-scroll mx-3 my-10 text-[0.7rem] containe">
                <div className="p-1 text-center font-bold">
                  <div>
                    {conversation?.map((friend, index) => (
                      <div
                        className={`flex md:gap-2 text-center my-2 conversation-item conversation-item-${index} ${
                          selectedConversation?._id === friend._id
                            ? "bg-[#12141d] text-[#fff] ring-2 ring-white"
                            : "bg-white text-black"
                        } items-center p-1 rounded-3xl justify-between`}
                        key={index}
                        onClick={() => selectUSer(friend)}
                      >
                        <div className="flex gap-5 items-center ">
                          {friend.profilePhoto.url ? (
                            <img
                              className="ring-1 ring-gray-500 rounded-full w-10"
                              src={friend.profilePhoto.url}
                            />
                          ) : (
                            <img
                              className="ring-1 ring-gray-500 rounded-full w-10"
                              src="avatar.svg"
                            />
                          )}
                          <p className="">{friend.fullname}</p>
                        </div>
                        <div className="mr-4">
                          <p className="">
                            {onlineUsers?.includes(friend._id) ? (
                              <span className="relative flex h-3 w-3">
                                <span
                                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                                    selectedConversation?._id === friend._id
                                      ? "bg-white"
                                      : "bg-[#12141d]"
                                  }  opacity-75`}
                                ></span>
                                <span
                                  className={`relative inline-flex rounded-full h-3 w-3 ${
                                    selectedConversation?._id === friend._id
                                      ? "bg-white"
                                      : "bg-[#12141d]"
                                  }`}
                                ></span>
                              </span>
                            ) : (
                              ""
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* mobile view */}
      </div>
      {/* left end */}
      <div className="col-span-3 bg-black max-sm:col-span-full">
        <div className="flex justify-between min-h-[8dvh] mx-4">
          <div className="flex md:gap-5 items-center justify-between w-full text-[#fff]">
            <div className="flex gap-4 justify-center items-center ">
              <TiThMenu
                className="md:hidden text-[1.5rem]"
                onClick={() => setOpen(true)}
              />
              {selectedConversation?.profilePhoto?.url ? (
                <img
                  className="ring-1 ring-gray-500 rounded-full w-10 max-sm:w-7"
                  src={selectedConversation?.profilePhoto?.url}
                />
              ) : (
                <img
                  className="ring-1 ring-gray-500 rounded-full w-10 max-sm:w-7"
                  src="avatar.svg"
                />
              )}
              <p className="max-md:text-[12px]">
                {selectedConversation?.fullname}
              </p>
            </div>
            <div className="flex justify-between items-center gap-4">
              <IoArrowBackCircle
                onClick={handleGoBack}
                className="text-[#fff] text-[2rem] max-md:text-[1.9rem]"
              />
            </div>
          </div>
        </div>
        <div className={`col-span-3 overflow-y-scroll h-[85dvh] max-md:h-[83dvh] ${selectedConversation ? "":"max-sm:h-[92dvh]"} py-2 overflow-x-hidden max-sm:text-[0.5rem]`}>
          {selectedConversation ? messages?.map((item, index) => (
            <div className="text-[12px]" key={index}>
              {item.senderId !== authUser._id ? (
                <>
                  <div className="flex justify-start mx-4">
                    <div className="p-2 m-2 rounded-r-xl rounded-t-xl max-w-[50%] text-[#fff] bg-[#12141d]">
                      <p className="whitespace-normal break-words text-balance mx-2 font-medium">
                        {item.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start text-xs text-[#fff] gap-4 mx-4">
                    {item?.url ? (
                      <img
                        className="ring-1 ring-gray-500 rounded-full w-5"
                        src={item?.url}
                      />
                    ) : (
                      <img
                        className="ring-1 ring-gray-500 rounded-full w-5"
                        src="avatar.svg"
                      />
                    )}

                    <p className="text-[0.5rem]">{item.sender}</p>
                    <p className="text-[0.5rem]">
                      {dateConvert(item.createdAt)}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-end mx-4">
                    <div className="p-2 m-2 max-w-[50%] rounded-l-xl rounded-t-xl text-[#12141d] bg-[#3EE4CA]">
                      <p className="whitespace-normal break-words text-balance mx-2 font-medium">
                        {item.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end text-[#fff] text-xs gap-4 mx-4">
                    <p className="text-[0.5rem]">
                      {dateConvert(item.createdAt)}
                    </p>
                    <p className="text-[0.5rem]">{item.sender}</p>
                    {item?.url ? (
                      <img
                        className="ring-1 ring-gray-500 rounded-full w-5"
                        src={item?.url}
                      />
                    ) : (
                      <img
                        className="ring-1 ring-gray-500 rounded-full w-5"
                        src="avatar.svg"
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        :
        <p className={`text-white w-full flex justify-center items-center h-[80dvh] max-md:h-[86dvh] right-1 ${selectedConversation ? "":"max-sm:h-[86dvh]"}`}>
            Click the <TiThMenu className=" mx-1 text-[1.5rem] max-sm:text-[0.7rem]"onClick={() => setOpen(true)}/> to start a conversation.
        </p>
        }
          <div className={`fixed bottom-0 p-2 w-[75%] bg-black max-sm:w-full ${selectedConversation ? "visible":"hidden"}`}>
            <div className="flex items-center md:mx-6">
              <div
                className={`flex w-full justify-between items-center rounded-3xl bg-white text-center`}
              >
                <input
                  type="text"
                  className="w-full max-sm:w-[90%] h-10 bg-transparent text-[12px] rounded-3xl px-4 focus:outline-none text-[#000]"
                  name="currentMessage"
                  value={currentMessage || ""}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <input
                  type="button"
                  value="send"
                  onClick={handleSubmitMessage}
                  className="bg-black text-[12px] text-white w-[25%] md:w-[10%] h-10 cursor-pointer m-1 max-md:w-[15%] rounded-full text"
                />
              </div>
            </div>
          </div>
          <div ref={bottomRef}></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
