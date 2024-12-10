import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import MdLoader from '../spinner/MdLoader';
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

const DownloadVendorContact = () => {
  const { adminData } = useContext(AppContext);
  const [loader, setLoader] = useState(false);

  const downloadFile = async () => {
    try {
      setLoader(true);
      const response = await axios({
        url: `${process.env.REACT_APP_BASE_URL}/download/vendor-contact-us/${adminData.user_id}`, 
        method: 'GET',
        responseType: 'blob',
      });

      // Create a new Blob object using the response data
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'contact-us.xlsx'); // File name

      // Append to the body, click to download, and remove the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the file:', error);
      alert('There was an error downloading the file');
    } finally{
      setLoader(false);
    }
  };

  return (
    <button onClick={downloadFile} className='border-none text-base flex justify-center items-center w-[120px] h-[35px] bg-teal-500 rounded hover:bg-teal-600'>
      {loader ? (<MdLoader/>) : (<span className='flex justify-center items-center gap-2'><PiMicrosoftExcelLogoFill/> Download</span>)}
    </button>
  );
};

export default DownloadVendorContact;