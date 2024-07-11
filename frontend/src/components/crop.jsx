import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./canvasPreview";
import { MdDriveFolderUpload } from "react-icons/md";
import { useDebounceEffect } from "./useDebounceEffect";
import axios from "axios";
import { useAuthContext } from "../context/authContextProvider";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { CgGenderFemale } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineJoinLeft } from "react-icons/md";

export default function ImageCrop() {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const { authUser, setAuthUser } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [aspect, setAspect] = useState(1 / 1);
  const [open, setOpen] = useState(false);

  const centerAspectCrop = useCallback((mediaWidth, mediaHeight, aspect) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }, []);

  const onImageLoad = useCallback(
    (e) => {
      if (aspect) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspect));
      }
    },
    [centerAspectCrop]
  );

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onDownloadCropClick = async () => {
    try {
      const image = imgRef.current;
      const previewCanvas = previewCanvasRef.current;
      if (!image || !previewCanvas || !completedCrop) {
        throw new Error("Crop canvas does not exist");
      }
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const offscreen = new OffscreenCanvas(
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );
      const ctx = offscreen.getContext("2d");
      if (!ctx) {
        throw new Error("No 2d context");
      }

      ctx.drawImage(
        previewCanvas,
        0,
        0,
        previewCanvas.width,
        previewCanvas.height,
        0,
        0,
        offscreen.width,
        offscreen.height
      );

      const blob = await offscreen.convertToBlob({
        type: "image/png",
      });

      const date = Date.now();
      const imagename = `photo${date}`;

      const file = new File([blob], imagename, {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "SocilaMedia");

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/sociladb/image/upload`,
        formData
      );
      if (cloudinaryResponse.status !== 200) {
        throw new Error("Failed to upload image to Cloudinary");
      }
      const { secure_url: url, public_id } = cloudinaryResponse.data;
      const data = { url, public_id };

      const postResponse = await axios.post(`/api/profile/update`, { data });
      if (postResponse.status !== 200) {
        throw new Error("Failed to update profile photo");
      }
      // Triggering UI update by re-fetching profile data
      fetchProfile();
    } catch (error) {
      console.error("Error during image upload and profile update:", error);
      throw error;
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/profile");
      setAuthUser(response.data.data);
      setLoading(false);
      setOpen(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  }, [setAuthUser]);

  useDebounceEffect(
    () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const dateConvert = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="w-full h-[100dvh] flex justify-center items-center bg-black text-white">
        <div role="status">
          <svg
            aria-hidden="true"
            class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] font-bold w-full flex justify-center items-center bg-black text-white">
      <div className=" p-16 max-sm:p-4 rounded-lg md:ring-1 ring-white">
        <div className="flex items-end max-sm:items-center justify-between max-sm:flex-col gap-10 w-full m-auto max-sm:gap-4">
          <div className="flex justify-between flex-col items-center gap-6">
            <div>
              {authUser?.profilePhoto?.url ? (
                <img
                  src={authUser?.profilePhoto?.url}
                  alt="Profile"
                  className="w-[200px] h-auto rounded-full ring-2 ring-white"
                />
              ) : (
                <img
                  alt="Profile"
                  className="w-[200px] h-auto rounded-full ring-2 ring-white"
                  src="avatar.svg"
                />
              )}
            </div>
            <div className="text-start">
              <div>
                <p className="text-[1.2rem] upper flex gap-4 items-center justify-start">
                  <FaUser />
                  {authUser?.fullname}
                </p>
                <p className="text-[0.7rem] upper flex gap-4 items-center justify-start">
                  <span className="text-[1.2rem]">
                    <MdEmail />
                  </span>
                  {authUser?.email}
                </p>
                <p className="text-[0.7rem] upper flex gap-4 items-center justify-start">
                  <span className="text-[1.2rem]">
                    <CgGenderFemale />
                  </span>
                  {authUser?.gender}
                </p>

                <p className="text-[0.7rem] upper flex gap-4 items-center justify-start">
                  <span className="text-[1.2rem]">
                    <MdOutlineJoinLeft />
                  </span>
                  Join In {dateConvert(authUser.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center flex-col items-center gap-3">
            <input
              type="file"
              name="file"
              id="file"
              className="inputfile"
              onChange={onSelectFile}
            />
            <canvas
              className="outline outline-4 outline-offset-2 h-[40vh] max-h-[30vh] hidden"
              ref={previewCanvasRef}
            />
          </div>
          <div
            className={`${
              open ? "visible" : "hidden"
            } fixed top-1/2 left-1/2 max-md:w-[300px] max-md:h-[300px] bg-black ring-1 ring-white shadow-2xl text-[#12141d] transform -translate-x-1/2 -translate-y-1/2 z-20 rounded-3xl`}
          >
            <div className="fixed -right-12 max-sm:right-0 max-sm:-top-12 w-[40px] h-[40px] flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg rounded-full cursor-pointer">
              <RxCross2 className="text-white" onClick={() => setOpen(false)} />
            </div>
            <div className={`flex justify-center items-center w-full p-5`}>
              {imgSrc !== "" ? (
                <div
                  style={{
                    maxWidth: "500px",
                    maxHeight: "500px",
                    overflow: "hidden",
                  }}
                >
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    minHeight={100}
                    className="outline outline-2 outline-offset-2 ring-2 ring-black"
                  >
                    <img
                      className="ring-2 ring-black"
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </div>
              ) : authUser?.profilePhoto?.url ? (
                <img
                  src={authUser?.profilePhoto?.url}
                  alt="Profile"
                  className="w-[400px] h-auto ring-2 ring-black"
                />
              ) : (
                <img
                  alt="Profile"
                  className="w-[400px] h-auto ring-2 ring-black"
                  src="avatar.svg"
                />
              )}
            </div>
            <div className="flex gap-5 justify-center items-center p-5">
              <label
                htmlFor="file"
                className="ring-1 ring-white py-3 px-9 rounded-full"
              >
                <MdDriveFolderUpload className="text-white" />
              </label>
              <button
                className="ring-1 ring-white text-white py-2 px-5 rounded-full"
                name="submit"
                onClick={onDownloadCropClick}
              >
                Submit
              </button>
            </div>
          </div>
          <div
            className={`${
              open ? "visible" : "hidden"
            } fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-lg z-10`}
          ></div>
          <button
            className="ring-1 ring-white text-white py-2 px-5 rounded-full"
            name="submit"
            onClick={() => setOpen(true)}
          >
            Edit Photo
          </button>
        </div>
      </div>
    </div>
  );
}
