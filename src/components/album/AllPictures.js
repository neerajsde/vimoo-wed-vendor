import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import Spinner from '../../components/spinner/MdLoader'
import toast from 'react-hot-toast';
import axios from 'axios';
import ModalImage from "react-modal-image";

const AllPictures = () => {
    const {adminData, setImageViewActive} = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState(null);

    const fetchVendorData = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('VideekVendor');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/vendor/${adminData.user_id}/albums`, config);
            setImages(response.data.data);
        } catch (err) {
            toast.error(err.message)
        } finally{
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(!images && adminData.user_id){
            fetchVendorData();
        }
    },[adminData])

    if(isLoading){
        return (
            <div className='w-full h-[300px] flex justify-center items-center'>
                <Spinner/>
            </div>
        )
    }

    if(!images){
        return (
            <div className='w-full py-6 flex justify-center items-center'>
                <h2 className='text-2xl font-semibold text-gray-500'>Empty Images</h2>
            </div>
        )
    }

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {
            images && images.map((img, index) => (
                <img
                    src={`${process.env.REACT_APP_BASE_URL}/vendor${img}`}
                    alt='img-not-found'
                    className='w-full h-full object-cover cursor-pointer'
                    onClick={() => {
                        setImageViewActive({
                            isActive: true, 
                            AllImages:images, 
                            dirName:'vendor', 
                            index: index
                        })
                    }}
                />
            ))
        }
    </div>
  )
}

export default AllPictures