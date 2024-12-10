import React, {useState, useEffect, useContext} from 'react'
import axios from "axios"
import MdLoader from '../spinner/MdLoader';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast"
import { AppContext } from '../../context/AppContext';
import { MdEdit } from "react-icons/md";

const Settings = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const {adminData} = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [img, setImg] = useState(null);
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorImg, setErrorImg] = useState("");
    const [successImg, setSuccessImg] = useState("");
    const [imgLoading, setImgLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name:'',
        phone:'',
        whatsapp:'',
        email:'',
        title:'',
        price:'',
        profilePic: '',
    });

    function inputHandler(event){
        const {name, value} = event.target;
        if(name === 'phone' && value > 9999999999){
            return;
        }
        if(name === 'whatsapp' && value > 9999999999){
            return;
        }
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        setImg(e.target.files[0]);
    };
    
    const handleDescriptionChange = (value) => {
        setDescription(value);
    };

    const fetchVendorDataInsight = async (vendorId) => {
        try {
          setLoading(true);
          const token = localStorage.getItem('VideekVendor');
          if (!token) {
            toast.error('Authentication token not found');
            return;
          }
      
          // Make the API call using fetch
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/vendor/details/${vendorId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          const result = await response.json();
      
          if (result.success) {
            setData(result.data);
            setFormData({
                name:result.data.name,
                phone:result.data.phone,
                whatsapp:result.data.whatsapp,
                email:result.data.email,
                title:result.data.title,
                price:result.data.price_range,
                profilePic: result.data.user_img
            })
            setDescription(result.data.description);
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

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        if(!adminData.user_id){
            setError('Something went wrong');
            return;
        }

        try {
            setIsLoading(true);
            const formXData = new FormData();
            formXData.append("vendor_id", adminData.user_id);
            formXData.append("name", formData.name);
            formXData.append("phone", formData.phone);
            formXData.append("whatsapp", formData.whatsapp);
            formXData.append("email", formData.email);
            formXData.append("title", formData.title);
            formXData.append("price", formData.price);
            formXData.append("description", description);
            if(img){
                formXData.append("img", img);
            }

            const response = await axios.put(`${baseUrl}/vendor/update`, formXData);
            if (response.data.success) {
                setSuccessMessage(response.data.message);
                toast.success(response.data.message);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError("Internal Server Error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    const ProfilePicChangeHandler = async (img) => {
        setSuccessImg('');
        setErrorImg('');
        try {
            setImgLoading(true);
            // Get the logo file from the form
            const formData = new FormData();

            // Check if a file is selected
            if (!img) {
                setErrorImg('Please select a Profile Pic to upload');
                return;
            }
            formData.append('vendor_id', adminData.user_id);
            formData.append('img', img);

            // Get the admin token from localStorage (if required)
            const token = localStorage.getItem('VideekAdmin');
            if (!token) {
                setErrorImg('Unauthorized. Please log in again.');
                return;
            }

            // Send the request to the backend
            const response = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/vendor/profile-pic/change`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Handle success response
            if (response.data.success) {
                setFormData((prevState) => ({
                    ...prevState,
                    profilePic: response.data.data
                }));
                setSuccessImg('Profile Picture updated successfully');
            } else {
                setErrorImg(response.data.message);
            }
        } catch (error) {
            setErrorImg(error.response?.data?.message || error.message);
        } finally{
            setImgLoading(false);
        }
    };

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
    <div className="w-full flex flex-col bg-black p-6 gap-4">
        <div className="w-full flex justify-center items-center">
            <div className="flex flex-col gap-2">
                <div className="w-full flex flex-col justify-center items-center gap-1">
                    <div 
                        className="w-[100px] h-[100px] border-4 border-blue-600 rounded-full overflow-hidden cursor-pointer flex justify-center items-center bg-[#111] relative group" 
                        onClick={() => document.getElementById("profileInput").click()}
                    >
                        <img 
                            src={
                                formData.profilePic
                                    ? `${process.env.REACT_APP_BASE_URL}${formData.profilePic}`
                                    : `https://api.dicebear.com/5.x/initials/svg?seed=${data.name}` // Placeholder image
                            } 
                            alt="Profile Pic" 
                            className="w-full h-full object-cover"
                        />
                        {imgLoading ? (
                            <div className='absolute top-0 left-0 w-full h-full bg-[#000000b5] flex justify-center items-center'>
                                <MdLoader/>
                            </div>
                        ) : 
                        (
                            <div className='hidden absolute top-0 left-0 w-full h-full bg-[#000000b5] transition-all duration-200 ease-in group-hover:flex justify-center items-center'>
                                <MdEdit className='text-2xl text-white'/>
                            </div>
                        )}
                    </div>
                    <input
                        id="profileInput"
                        type="file"
                        name="profile"
                        onChange={(e) => {
                            ProfilePicChangeHandler(e.target.files[0]);
                        }}
                        accept="image/*"
                        required
                        className="hidden"
                    />
                    <label className="text-gray-400 text-base font-medium text-center">
                        Change Profile Pic
                    </label>
                </div>
                <div className="w-full flex justify-start items-center gap-4">
                    {errorImg && <p className="text-sm font-semibold text-red-600">{errorImg}</p>}
                    {successImg && (
                        <p className="text-sm font-semibold text-green-600">
                            {successImg}
                        </p>
                    )}
                </div>
            </div>
        </div>
        <h2 className="text-2xl font-bold text-cyan-600 pt-8">Update your details</h2>
        <form onSubmit={submitHandler} className="w-full flex flex-col gap-4">
            <div className="w-full flex justify-between gap-4">
                <div className="w-full flex flex-col gap-1">
                    <label className="text-gray-400 text-base font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={inputHandler}
                        required
                        placeholder="Vendor name"
                        className="w-full py-2 px-4 bg-[#111] border placeholder:text-gray-700 border-[#333] outline-none text-lg text-white focus:border-yellow-600 rounded-sm"
                    />
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-gray-400 text-base font-medium">Price Range</label>
                    <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={inputHandler}
                        required
                        placeholder="enter like this: 10,000 - 20,000"
                        className="w-full py-2 px-4 bg-[#111] border placeholder:text-gray-700 border-[#333] outline-none text-lg text-white focus:border-yellow-600 rounded-sm"
                    />
                </div>
            </div>

            <div className="w-full flex justify-between gap-4">
                <div className="w-full flex flex-col gap-1">
                    <label className="text-gray-400 text-base font-medium">Phone</label>
                    <input
                        type="number"
                        name="phone"
                        value={formData.phone}
                        onChange={inputHandler}
                        required
                        placeholder="Vendor mobile no"
                        className="w-full py-2 px-4 bg-[#111] border placeholder:text-gray-700 border-[#333] outline-none text-lg text-white focus:border-yellow-600 rounded-sm"
                    />
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-gray-400 text-base font-medium">WhatsApp</label>
                    <input
                        type="number"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={inputHandler}
                        required
                        placeholder="Vendor whatsapp no"
                        className="w-full py-2 px-4 bg-[#111] border placeholder:text-gray-700 border-[#333] outline-none text-lg text-white focus:border-yellow-600 rounded-sm"
                    />
                </div>
            </div>

            <div className="w-full flex justify-between gap-4">
                <div className="w-full flex flex-col gap-1">
                    <label className="text-gray-400 text-base font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={inputHandler}
                        required
                        placeholder="Vendor email id"
                        className="w-full py-2 px-4 bg-[#111] border placeholder:text-gray-700 border-[#333] outline-none text-lg text-white focus:border-yellow-600 rounded-sm"
                    />
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-gray-400 text-base font-medium">Upload Banner Img</label>
                    <input
                        type="file"
                        name="img" 
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full h-[45px] placeholder:text-gray-700 py-1 px-2 bg-[#111] border-2 border-[#333] border-dashed outline-none text-lg text-white focus:border-yellow-600 rounded-sm"
                    />
                </div>
            </div>

            <div className="w-full flex flex-col gap-1">
                <label className="text-gray-400 text-base font-medium">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={inputHandler}
                    required
                    placeholder="write heading"
                    className="w-full py-2 px-4 bg-[#111] border placeholder:text-gray-700 border-[#333] outline-none text-lg text-white focus:border-yellow-600 rounded-sm"
                />
            </div>

            <div className="w-full flex flex-col gap-1">
                <label className="text-gray-400 text-base font-medium">
                    Description
                </label>
                <ReactQuill
                    value={description}
                    onChange={handleDescriptionChange}
                    className="text-white"
                />
            </div>

            <div className="w-full flex justify-start items-center gap-4">
                <div className=" flex gap-1">
                    <button
                    type="submit"
                    className="h-[45px] w-[200px] rounded-sm flex justify-center items-center py-2 px-4 border-none outline-none text-lg text-white bg-cyan-600 transition duration-200 ease-in hover:bg-cyan-800"
                    >
                    {isLoading ? <MdLoader /> : "Save"}
                    </button>
                </div>

                {/* Error and Success Messages */}
                {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
                {successMessage && (
                    <p className="text-sm font-semibold text-green-600">
                        {successMessage}
                    </p>
                )}
            </div>
        </form>
    </div>
  )
}

export default Settings