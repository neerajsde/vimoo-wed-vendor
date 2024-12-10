import React, { useContext, useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";
import { AppContext } from "../../context/AppContext";
import { CiLock } from "react-icons/ci";
import MdLoader from "../spinner/MdLoader";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { IoMdCall } from "react-icons/io";
import DownloadVendorContact from "../common/DownloadVendorContact";

const Enquiry = () => {
  const [contactsData, setContactsData] = useState(null);
  const [unLockData, setunLockedData] = useState(null);
  const { adminData, webData } = useContext(AppContext);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("Razorpay script loaded successfully");
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay script");
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if(!contactsData) return;
    const arr = [];
    for(let k=0; k<contactsData.length; k++){
        arr.push(false);
    }
    setLoading(arr);
  },[contactsData]);

  const fetchAllEnquries = async (vendorId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/vendor/enquiry/${vendorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }

      const data = await response.json();
      setContactsData(data.data);
    } catch (error) {
      setContactsData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnlockedEnquries = async (vendorId) => {
    try {
      const token = localStorage.getItem("VideekVendor");
        if (!token) {
            throw new Error("Token not found. Please log in again.");
        }
      const response = await fetch(`${baseUrl}/vendor/enquiry/unlocked/${vendorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if(data.success){
        setunLockedData(data.data);
      }
    } catch (error) {
        setunLockedData(null);
    }
  };

  useEffect(() => {
    fetchAllEnquries(adminData.user_id);
    fetchUnlockedEnquries(adminData.user_id);
  }, [adminData]);

  const createOrder = async (amount) => {
    const response = await fetch(`${baseUrl}/payment/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount * 100 }), // Convert INR to Paisa
    });
    return response.json();
  };

  const updateToUnlockContactData = async (enquiryId) => {
    try{
        const response = await fetch(`${baseUrl}/payment/vendor/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                vendorId: adminData.user_id, 
                enquiryId: enquiryId
            }),
          });
        const data = await response.json();
        if(data.success){
            await fetchUnlockedEnquries(adminData.user_id);
            toast.success(data.message)
        }
        else{
            toast.error(data.message)
        }
    } catch(err){
        toast.error(err.message);
    }
  }

  const paymentVerify = async (rezorpay, enquiryId) => {
    try{
        const response = await fetch(`${baseUrl}/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: rezorpay.razorpay_order_id, 
              payment_id: rezorpay.razorpay_payment_id        , 
              signature: rezorpay.razorpay_signature
            }),
          });
        const data = await response.json();
        if(data.success){
            await updateToUnlockContactData(enquiryId);
            // toast.success(data.message)
        }
        else{
            toast.error(data.message)
        }
    } catch(err){
        toast.error(err.message);
    }
  };

  const handlePayment = async (index, enquiryId) => {
    if (typeof window.Razorpay === "undefined") {
      console.error("Razorpay is not loaded");
      return;
    }

    try {
        setLoading((prevState) => {
            const curr = [...prevState];
            curr[index] = true;
            return curr;
        });
      const order = await createOrder(199); // Amount in INR

      const options = {
        key: process.env.REACT_APP_KEY_ID, // Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: webData ? webData?.title : 'Vimoo Wed',
        description: "Test Transaction",
        image: `${process.env.REACT_APP_BASE_URL}/webImg${webData?.logo}`,
        order_id: order.id, // Order ID from backend
        handler: function (response) {
          paymentVerify(response, enquiryId);
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Payment failed. Please try again.");
    } finally{
        setLoading((prevState) => {
            const curr = [...prevState];
            curr[index] = false;
            return curr;
        });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[90vh] flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full login h-full flex flex-col gap-8 p-4">
      <div className="w-full flex flex-col gap-4 border border-gray-400">
        <div className="w-full flex justify-between items-center px-4 pt-4">
            <h2 className="text-xl font-semibold uppercase text-green-600">
                Un-Locked Enquires for you
            </h2>
            <DownloadVendorContact/>
        </div>
        <div className="w-full">
            {!unLockData ? (
            <div className="text-center text-gray-500">Empty Testimonials</div>
            ) : (
            <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="border-b border-gray-600">
                    <th className="py-2 px-4 text-left login">Client Name</th>
                    <th className="py-2 px-4 text-center login">Phone</th>
                    <th className="py-2 px-4 text-center login">Email</th>
                    <th className="py-2 px-4 text-center login">Action</th>
                </tr>
                </thead>
                <tbody>
                {unLockData &&
                    unLockData.map((item, idx) => (
                    <tr key={item.id} className="border-b border-gray-300">
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4 text-center">{item.phone}</td>
                        <td className="py-2 px-4 text-center">
                            <Link to={`mailto:${item.email}`}>
                                {item.email}
                            </Link>
                        </td>
                        <td className="py-2 px-4 flex justify-center">
                        <Link
                            className="bg-green-600 px-4 py-2 text-white rounded-full flex items-center justify-center gap-1"
                            to={`tel:${item.phone}`}
                        >
                            <IoMdCall/>call
                        </Link>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 border border-gray-400">
        <h2 className="text-xl font-semibold uppercase text-yellow-600 pt-2 px-4">
            Client contact details for your services
        </h2>
        <div className="w-full">
            {!contactsData ? (
            <div className="text-center text-gray-500">Empty Testimonials</div>
            ) : (
            <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="border-b border-gray-600">
                    <th className="py-2 px-4 text-left login">Client Name</th>
                    <th className="py-2 px-4 text-center login">Phone</th>
                    <th className="py-2 px-4 text-center login">Email</th>
                    <th className="py-2 px-4 text-center login">Action</th>
                </tr>
                </thead>
                <tbody>
                {contactsData &&
                    contactsData.map((item, idx) => (
                    <tr key={item.id} className="border-b border-gray-300">
                        <td className="py-2 px-4">{item.user_name}</td>
                        <td className="py-2 px-4 text-center">{item.phone}</td>
                        <td className="py-2 px-4 text-center">{item.email}</td>
                        <td className="py-2 px-4 flex justify-center">
                        <button
                            className="bg-orange-600 w-[160px] h-[40px] px-4 py-2 text-white rounded-full flex items-center justify-center gap-1"
                            onClick={() => handlePayment(idx, item.id)}
                        >
                            {loading[idx] ? (<MdLoader/>) : (<span className="flex items-center justify-between gap-1"><CiLock className="text-lg" /> Pay to unlock</span>)}
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>
      </div>
    </div>
  );
};

export default Enquiry;
