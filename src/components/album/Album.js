import React, { useContext, useState } from 'react'
import MdLoader from '../../components/spinner/MdLoader';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import axios from "axios"
import AllPictures from './AllPictures';

const Album = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const {adminData} = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileChange = (e) => {
        setImages([...e.target.files]);
    };

    const uploadImg = async (index) => {
        try {
            const formXData = new FormData();
            formXData.append("id", adminData.user_id);
            formXData.append("img", images[index]);
    
            const response = await axios.post(`${baseUrl}/vendor/album/img/upload`, formXData);
    
            if (response.data.success) {
                return 'success';
            } else {
                return 'error';
            }
        } catch (error) {
            return 'something went wrong';
        }
    };
    
    const imagesUploader = async () => {
        if (!adminData.user_id) {
            setSuccessMessage('');
            setErrorMessage('Please refresh the tab');
            toast.error('Please refresh the tab');
            return;
        }
        if (images.length === 0) {
            setSuccessMessage('');
            setErrorMessage('Please upload the images');
            toast.error('Please upload the images');
            return;
        }
    
        try {
            setIsLoading(true); 
            setSuccessMessage('');
            setErrorMessage('');
    
            // Sequential Upload Approach (Current)
            for (let index = 0; index < images.length; index++) {
                const res = await uploadImg(index);
                if (res !== 'success') {
                    toast.error(`Error uploading image ${index + 1}`);
                    return;
                }
            }
            setImages([]);
            setSuccessMessage('All images uploaded successfully');
            toast.success('All images uploaded successfully');
        } catch (err) {
            setErrorMessage('Something went wrong while uploading images');
            toast.error('Something went wrong while uploading images');
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className='w-full flex flex-col gap-4'>
        <div className='w-full p-4 border bg-[#111] border-[#333] flex gap-4'>
            <div className="w-full flex flex-col gap-1">
                <label className="text-gray-400 text-base font-medium">Upload images</label>
                <input
                    type="file"
                    name="img" 
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple 
                    required
                    className="w-full h-[45px] placeholder:text-gray-700 py-1 px-2 bg-[#111] border-2 border-[#333] border-dashed outline-none text-lg text-white focus:border-yellow-600 rounded-sm"
                />
            </div>

            <div className="w-full flex justify-start items-end gap-4">
                <div className="w-full flex flex-col gap-1">
                    {
                        errorMessage && (<span className='text-red-500 text-base font-semibold'>{errorMessage}</span>)
                    }
                    {
                        successMessage && (<span className='text-green-500 text-base font-semibold'>{successMessage}</span>)
                    }
                    <button
                        onClick={imagesUploader}
                        className="h-[45px] w-[200px] rounded-sm flex justify-center items-center py-2 px-4 border-none outline-none text-lg text-white bg-cyan-600 transition duration-200 ease-in hover:bg-cyan-800"
                    >
                    {isLoading ? <MdLoader /> : "Upload Images"}
                    </button>
                </div>
            </div>
        </div>

        <div className='w-full p-4 border bg-[#111] border-[#333] flex flex-col gap-4'>
            <h2 className='text-2xl font-semibold text-green-600'>Your Albums</h2>
            <AllPictures/>
        </div>
    </div>
  )
}

export default Album