import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useStateProvider } from "@/context/StateContext";
import Input from "@/components/common/Input";
import Avatar from "@/components/common/Avatar";
import axios from "axios";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { reducerCases } from "@/context/constants";

function Onboarding() {
  const [{ userInfo, newUser }, dispatch] = useStateProvider();
  const router = useRouter();
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/default_avatar.png");

  useEffect(() => { // state reducer :  newUser: false,
    if (!newUser && !userInfo?.email) router.push("/login");
    else if (!newUser && userInfo?.email) router.push("/");
  }, [newUser, router, userInfo]);

  const onBoardUserHandler = async () => {
    if (validateDetails()) {
      const email = userInfo.email;
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          image,
        });
        console.log("Data status:", data.status);
        if (data.status === true) {
          console.log("Success:", data.status);
          dispatch({ type: reducerCases.SET_NEW_USER, newUser: false });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: data.user.id,
              name,
              email,
              profileImage: image,
              status: about,
            },
          });
          router.push("/");
        } else {
          console.log("Onboarding failed:", data.message);
        }
      } catch (error) {
        console.error("Error during onboarding:", error);
      }
    }
  };
  
  const validateDetails = () => {
    if (name.length < 3) {
      return false;
    }
    return true;
  };
  return (
    <div className="h-screen w-screen text-white flex flex-col bg-panel-header-background items-center justify-center">
      <div className="flex items-center justify-center gap-3">
        <Image src="/whatsapp.gif" alt="whatsapp" height={300} width={300} />
        <span className="text-4xl font-extrabold">whatsapp</span>
      </div>
      <h2 className="text-2xl">Create Your WhatsApp Profile</h2>
      <div className="flex mt-5 gap-5 h-full items-center justify-center">
        {/* Input Fields */}
        <div className="flex flex-col gap-5">
          <Input name="Name" setState={setName} state={name} label="Name" />
          <Input name="About" setState={setAbout} state={about} label="About" />
          <div className="flex items-center justify-center">
            <button
              className="flex items-center justify-center gap-3 bg-search-input-container-background p-3 mb-10 rounded-lg"
              onClick={onBoardUserHandler}
            >
              <span className="text-white text-xl">create profile</span>
            </button>
          </div>
        </div>
        {/* Avatar Component */}
        <Avatar type="xl" image={image} setImage={setImage} />
      </div>
    </div>
  );
}

export default Onboarding;
