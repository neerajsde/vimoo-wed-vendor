import React, { useContext, useEffect, useState } from 'react';
import { FaUsers } from "react-icons/fa";
import { IoImage } from "react-icons/io5";
import { FaQuoteRight } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { BsFillUnlockFill } from "react-icons/bs";
import toast from 'react-hot-toast';
import { AppContext } from '../../context/AppContext';
import MdLoader from '../spinner/MdLoader';

const MainPage = () => {
  const { adminData } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVendorDataInsight = async (vendorId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('VideekVendor');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
  
      // Make the API call using fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/vendor/insight/${vendorId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (result.success) {
        setData(result.data);
      } else {
        setData(null);
        console.error('Error fetching vendor data:', result.message);
      }
    } catch (error) {
      console.error('Error while fetching vendor data insight:', error.message);
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorDataInsight(adminData.user_id);
  },[adminData]);

  if(loading){
    return (
      <div className='w-full h-[450px] flex justify-center items-center'><MdLoader/></div>
    )
  }

  if(!data){
    return (
      <div className='w-full h-[450px] flex justify-center items-center'>Something went wrong</div>
    )
  }
  
  return (
    <div className='w-full flex flex-col p-4 gap-6'>
      <div className='w-full grid grid-cols-5 gap-8'>
        <div className='w-full flex justify-center items-center flex-col gap-1 bg-[#222] rounded-lg p-4 relative'>
          <span className='bg-[#2af92a19] p-2 rounded-md absolute top-0 right-0'><FaUsers className='text-lg text-green-600'/></span>
          <span className='text-xl font-semibold'>{data.total_reviews}</span>
          <span className='text-base font-normal text-gray-400 text-center'>Customers Reviews</span>
        </div>

        <div className='w-full flex justify-center items-center flex-col gap-1 bg-[#222] rounded-lg p-4 relative'>
          <span className='bg-[#2a3bf930] p-2 rounded-md absolute top-0 right-0'><IoImage className='text-lg text-blue-600'/></span>
          <span className='text-xl font-semibold'>{data.total_images}</span>
          <span className='text-base font-normal text-gray-400 text-center'>Total Images</span>
        </div>

        <div className='w-full flex justify-center items-center flex-col gap-1 bg-[#222] rounded-lg p-4 relative'>
          <span className='bg-[#f9872a30] p-2 rounded-md absolute top-0 right-0'><FaQuoteRight className='text-lg text-orange-600'/></span>
          <span className='text-xl font-semibold'>{data.total_FAQs}</span>
          <span className='text-base font-normal text-gray-400 text-center'>Total FAQs</span>
        </div>

        <div className='w-full flex justify-center items-center flex-col gap-1 bg-[#222] rounded-lg p-4 relative'>
          <span className='bg-[#f92a2a30] p-2 rounded-md absolute top-0 right-0'><FaYoutube className='text-lg text-red-600'/></span>
          <span className='text-xl font-semibold'>{data.total_ytVideos}</span>
          <span className='text-base font-normal text-gray-400 text-center'>You Tube Videos</span>
        </div>

        <div className='w-full flex justify-center items-center flex-col gap-1 bg-[#222] rounded-lg p-4 relative'>
          <span className='bg-[#9f2af930] p-2 rounded-md absolute top-0 right-0'><BsFillUnlockFill className='text-lg text-violet-600'/></span>
          <span className='text-xl font-semibold'>{data.total_unlockedEnquires}</span>
          <span className='text-base font-normal text-gray-400 text-center'>Unlocked Enquires</span>
        </div>
      </div>
    </div>
  )
}

export default MainPage