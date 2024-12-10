import React, { useContext, useEffect, useState } from 'react'
import MdLoader from '../spinner/MdLoader';
import { AppContext } from '../../context/AppContext';
import { RiDeleteBin5Fill } from "react-icons/ri";
import toast from 'react-hot-toast';

const VideosHome = () => {
    const { adminData } = useContext(AppContext);
    const [inputData, setInputData] = useState('');
    const [success, setSucsess] = useState('');
    const [error, setError] = useState('');
    const [loader, setLoader] = useState(false);
    const [videosData, setVideosData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteLoader, setDeleteLoader] = useState([]);

    const submitHandler = async(e) => {
        e.preventDefault();
        setSucsess('');
        setError('');

        try {
            setLoader(true);
            const token = localStorage.getItem("VideekVendor");
            if (!token) {
                throw new Error("Token not found. Please log in again.");
            }
            // Example of an async operation like submitting data
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/vendor/admin/video/add`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    vendor_id: adminData.user_id,
                    url: inputData,
                }),
            });

            // Parse the response
            const result = await response.json();

            if (result.success) {
                setInputData('');
                await getAllVideosLinks();
                setSucsess(result.message);
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError("An error occurred while adding video link:");
        } finally{
            setLoader(false);
        }
    }

    const getAllVideosLinks = async(e) => {
        setSucsess('');
        setError('');

        try {
            setIsLoading(true);
            const token = localStorage.getItem("VideekVendor");
            if (!token) {
                throw new Error("Token not found. Please log in again.");
            }
            // Example of an async operation like submitting data
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/vendor/admin/video`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    vendor_id: adminData.user_id
                }),
            });

            // Parse the response
            const result = await response.json();

            if (result.success) {
                setVideosData(result.data);
            }
            else{
                setVideosData(null);
            }
        } catch (error) {
            setVideosData(null);
        } finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getAllVideosLinks();
    },[]);

    useEffect(() => {
        if(videosData){
            const arr = [];
            videosData.map((index) => {
                arr.push(false);
            });
            setDeleteLoader(arr);
        }
    },[videosData]);

    const deleteHandler = async(urlx, i) => {
        try {
            setDeleteLoader((prevState) => {
                const arr = [...prevState];
                arr[i] = true;
                return arr;
            });
            const token = localStorage.getItem("VideekVendor");
            if (!token) {
                throw new Error("Token not found. Please log in again.");
            }
            // Example of an async operation like submitting data
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/vendor/admin/video/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    vendor_id: adminData.user_id,
                    url: urlx,
                }),
            });

            // Parse the response
            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                await getAllVideosLinks();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding video link:");
        } finally{
            setDeleteLoader((prevState) => {
                const arr = [...prevState];
                arr[i] = false;
                return arr;
            });
        }
    } 

  return (
    <div className='w-full flex flex-col gap-4'>
        <form onSubmit={submitHandler} className='w-full flex flex-col border p-4 border-[#333] gap-2'>
            <h3 className='text-base text-gray-400'>Add Your Video Link</h3>
            <input
                type="text"
                name="inputData"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                required
                placeholder="paste embed youtube link e.g. https://www.youtube.com/embed/Cus-6cnyxx.."
                className="w-full py-2 px-4 bg-[#111] border placeholder:text-gray-700 border-[#333] outline-none text-lg text-white focus:border-yellow-600 rounded-sm"
            />
            <div className='w-full flex justify-start items-center gap-4'>
                <button 
                    type='submit'
                    className="h-[40px] w-[100px] rounded-sm flex justify-center items-center py-2 px-4 border-none outline-none text-lg text-white bg-cyan-600 transition duration-200 ease-in hover:bg-cyan-800"
                >{ loader ? (<MdLoader/>): 'Submit'}</button>
                {
                    success && (<p className='text-base text-green-500 font-semibold'>{success}</p>)
                }

                {
                    error && (<p className='text-base text-red-500 font-semibold'>{error}</p>)
                }
            </div>
        </form>

        <div className='w-full min-h-[200px] flex flex-col border p-4 border-[#333] gap-2'>
            <h3 className='w-full text-2xl text-teal-600 font-semibold'>All Videos</h3>
            {
                !isLoading ? (
                    videosData ? 
                    (
                        <div className='w-full grid grid-cols-3 gap-4'>
                            {
                                videosData.map((url, index) => (
                                    <div className='w-[300px] flex flex-col bg-[#555] p-2 gap-2'>
                                        <iframe 
                                            width="100%" 
                                            height="170" 
                                            src={url} 
                                            title="YouTube video player" 
                                            frameborder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                            referrerpolicy="strict-origin-when-cross-origin" 
                                            allowfullscreen
                                        ></iframe>
                                        <button onClick={() => deleteHandler(url, index)} className='w-full h-[35px] py-2 px-3 flex items-center justify-center gap-2 bg-teal-500 rounded shadow text-white hover:text-red-500 hover:bg-teal-700 transition duration-300 ease-in text-base font-semibold'>
                                            {deleteLoader[index] ? (<MdLoader/>) : (<span className='flex items-center justify-center'><RiDeleteBin5Fill/>Delete</span>)}
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    ) : 
                    (
                        <div className='w-full h-full flex justify-center items-center text-xl text-gray-500 font-semibold'>Empty Videos</div>
                    )
                ): 
                (<div className='w-full h-full flex justify-center items-center text-xl text-gray-500 font-semibold'><MdLoader/></div>)
            }
        </div>
    </div>
  )
}

export default VideosHome