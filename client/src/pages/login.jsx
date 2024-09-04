import React, { useEffect } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function Login() {
  const router = useRouter();
  let isPopupOpen = false; // To prevent multiple popups
  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  useEffect(() => {
    // Redirect based on userInfo and newUser state
    if (userInfo?.id) {
      if (newUser) {
        router.push("/onboarding");
      } else {
        router.push("/");
      }
    }
  }, [userInfo, newUser, router]);

  const handleLogin = async () => {
    if (isPopupOpen) return; // Prevents opening multiple popups
    isPopupOpen = true;
  
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const { user } = result; // Destructure user from result
      const { displayName: name, email, photoURL: profileImage } = user;
  
      console.log("Firebase user object:", user);
      console.log("User details:", { name, email, profileImage });
  
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });
  
        console.log("API response data:", data);
  
        if (data.status && data.msg === "User is found") {
          // Assuming the API does not return user data, handle this accordingly
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              email,
              name,
              profileImage,
              status: "", // Provide a default value or fetch it from another source
            },
          });
          router.push("/");
        } else if (!data.status) {
          // If the user is new
          dispatch({ type: reducerCases.SET_NEW_USER, newUser: true });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              name,
              email,
              profileImage,
              status: "",
            },
          });
          router.push("/onboarding");
        } else {
          console.error("Unexpected API response format:", data);
        }
      }
    } catch (error) {
      if (error.code === "auth/cancelled-popup-request") {
        console.log("Sign-in was canceled by the user or another request.");
      } else {
        console.error("Error during sign-in:", error);
      }
    } finally {
      isPopupOpen = false; // Reset the flag after sign-in attempt
    }
  };
  
  return (
    <div className="h-screen w-screen gap-5 flex justify-center items-center flex-col bg-panel-header-background">
      <div className="flex items-center justify-center gap-3 text-white">
        <Image
          src="/whatsapp.gif"
          alt="whatsapp img"
          height={300}
          width={300}
        />
        <span className="font-extrabold text-5xl">WhatsApp</span>
      </div>
      <button
        className="flex items-center justify-center gap-3 bg-search-input-container-background p-3 rounded-lg"
        onClick={handleLogin}
      >
        <FcGoogle className="text-5xl" />
        <span className="text-white text-xl">Login with Google</span>
      </button>
    </div>
  );
}

export default Login;
