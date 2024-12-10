import React, { useContext, useEffect, useState } from "react";
import { TbLogout } from "react-icons/tb";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa";
import MainPage from "../components/home/MainPage";
import FAQs from "../components/FAQs/FAQs";
import Album from "../components/album/Album";
import { MdPhotoAlbum } from "react-icons/md";
import { RxVideo } from "react-icons/rx";
import VideosHome from "../components/youtube/VideosHome";
import { MdQueryBuilder } from "react-icons/md"
import Enquiry from "../components/enquiry/Enquiry";
import { IoMdSettings } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import Settings from "../components/settings/Settings";


const Home = () => {
  const { setIsLoggedIn, adminData, webData } = useContext(AppContext);
  const [currentSection, setCurrentSection] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    window.document.title = "Vendor Dashboard";
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("VideekVendor");
    setIsLoggedIn(false);
    navigate("/");
    toast.error("Log Out Successfully");
  };

  const scrollToDiv = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToDiv("header");
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-black">
      <div id="header" className="w-full flex justify-between items-center py-1 px-8 bg-[#111]">
        <img src={`${process.env.REACT_APP_BASE_URL}/webImg${webData?.logo}`} alt="LOGO" className="w-[150px] max-lg:w-[100px]" />

        <div className="flex items-center text-white gap-2">
          {adminData && (
            <div className="w-[40px] h-[40px] flex justify-center items-center border-2 border-yellow-600 rounded-full">
              <img
                src={ adminData.user_img === '' ? `https://api.dicebear.com/5.x/initials/svg?seed=${adminData.name}` : `${process.env.REACT_APP_BASE_URL}${adminData.user_img}`}
                alt={adminData.name}
                className="rounded-full w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="text-base font-semibold">{adminData.name}</div>
        </div>
      </div>

      <div className="w-full flex justify-start items-start">
        <div className="w-[300px] h-screen sticky top-0 flex flex-col items-center justify-start bg-[#111] border-r border-t border-[#222]">

          <button
            onClick={() => setCurrentSection("dashboard")}
            className={`w-full py-2 flex justify-start px-4 items-center gap-4 text-gray-400 text-lg font-semibold transition duration-300 ease-in-out ${
              currentSection === "dashboard"
                ? "bg-[#222] text-white"
                : "hover:bg-[#000] hover:text-white"
            }`}
          >
            <MdDashboard className="text-xl" /> Dashboard
          </button>

          <button
            onClick={() => setCurrentSection("album")}
            className={`w-full py-2 flex justify-start px-4 items-center gap-4 text-gray-400 text-lg font-semibold transition duration-300 ease-in-out ${
              currentSection === "album"
                ? "bg-[#222] text-white"
                : "hover:bg-[#000] hover:text-white"
            }`}
          >
            <MdPhotoAlbum className="text-xl" /> Album
          </button>

          <button
            onClick={() => setCurrentSection("video-links")}
            className={`w-full py-2 flex justify-start px-4 items-center gap-4 text-gray-400 text-lg font-semibold transition duration-300 ease-in-out ${
              currentSection === "video-links"
                ? "bg-[#222] text-white"
                : "hover:bg-[#000] hover:text-white"
            }`}
          >
            <RxVideo className="text-xl" /> Videos Links
          </button>

          <button
            onClick={() => setCurrentSection("faqs")}
            className={`w-full py-2 flex justify-start px-4 items-center gap-4 text-gray-400 text-lg font-semibold transition duration-300 ease-in-out ${
              currentSection === "faqs"
                ? "bg-[#222] text-white"
                : "hover:bg-[#000] hover:text-white"
            }`}
          >
            <FaQuestionCircle className="text-xl" /> FAQs
          </button>

          <button
            onClick={() => setCurrentSection("enquiry")}
            className={`w-full py-2 flex justify-start px-4 items-center gap-4 text-gray-400 text-lg font-semibold transition duration-300 ease-in-out ${
              currentSection === "enquiry"
                ? "bg-[#222] text-white"
                : "hover:bg-[#000] hover:text-white"
            }`}
          >
            <MdQueryBuilder className="text-xl" /> Client Enquiry
          </button>

          <button
            onClick={() => setCurrentSection("settings")}
            className={`w-full py-2 flex justify-start px-4 items-center gap-4 text-gray-400 text-lg font-semibold transition duration-300 ease-in-out ${
              currentSection === "settings"
                ? "bg-[#222] text-white"
                : "hover:bg-[#000] hover:text-white"
            }`}
          >
            <IoMdSettings className="text-xl" /> Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2 flex justify-start px-4 items-center gap-4 text-red-400 text-lg font-semibold transition duration-300 ease-in-out hover:bg-[#000] hover:text-red-500"
          >
            <TbLogout className="text-xl text-red-600" /> LogOut
          </button>
        </div>

        <div className="w-full flex justify-start items-start text-white p-4">
          {currentSection === "dashboard" && <MainPage />}
          {currentSection === "album" && <Album />}
          {currentSection === "video-links" && <VideosHome />}
          {currentSection === "faqs" && <FAQs />}
          {currentSection === "enquiry" && <Enquiry />}
          {currentSection === "settings" && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default Home;
