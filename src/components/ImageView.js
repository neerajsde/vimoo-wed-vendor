import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { IoClose } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdFullscreen } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";

const ImageView = () => {
    const { imageViewActive, setImageViewActive } = useContext(AppContext);
    const [currIndex, setCurrIndex] = useState(imageViewActive.index);

    // Navigate to the previous image
    function leftBtnHandler() {
        if (currIndex === 0) {
            setCurrIndex(imageViewActive.AllImages.length - 1);
        } else {
            setCurrIndex(currIndex - 1);
        }
    }

    // Navigate to the next image
    function RightBtnHandler() {
        if (currIndex === (imageViewActive.AllImages.length - 1)) {
            setCurrIndex(0);
        } else {
            setCurrIndex(currIndex + 1);
        }
    }

    // Function to toggle fullscreen mode for the image
    function toggleFullScreen() {
        const imageElement = document.getElementById('fullscreen-image');
        if (imageElement && imageElement.requestFullscreen) {
            if (!document.fullscreenElement) {
                imageElement.requestFullscreen().catch((err) => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            } else {
                document.exitFullscreen().catch((err) => {
                    console.error(`Error attempting to exit full-screen mode: ${err.message}`);
                });
            }
        } else {
            console.error('The element does not support fullscreen mode or is undefined.');
        }
    }

    return (
        <div className='w-full h-full relative'>
            <div className='w-full px-6 max-sm:px-2 h-[60px] flex justify-between items-center absolute top-0 left-0 bg-[#000000b4] text-white'>
                <div className='flex justify-start items-center gap-4'>
                    <IoMdArrowRoundBack 
                        onClick={() => setImageViewActive({ isActive: false, index: 0, AllImages: '', dirName: '' })} 
                        className='text-xl cursor-pointer' 
                    />
                    <span className='text-base'>{imageViewActive.AllImages[currIndex].split('/').at(-1)}</span>
                </div>
                <div className='flex justify-start items-center gap-2'>
                    <MdFullscreen 
                        onClick={toggleFullScreen} 
                        className='text-2xl cursor-pointer' 
                    />
                    <IoClose 
                        onClick={() => setImageViewActive({ isActive: false, index: 0, AllImages: '', dirName: '' })} 
                        className='text-3xl cursor-pointer' 
                    />
                </div>
            </div>
            <div onClick={leftBtnHandler} className='absolute top-[50%] left-1 cursor-pointer text-white'>
                <FaChevronLeft className='text-4xl max-sm:text-xl'/>
            </div>
            <div onClick={RightBtnHandler} className='absolute top-[50%] right-1 cursor-pointer text-white'>
                <FaChevronRight className='text-4xl max-sm:text-xl'/>
            </div>
            <div className='w-full h-full flex justify-center items-center pt-[60px]'>
                <img 
                    id="fullscreen-image" // Add this ID to target the image for fullscreen
                    src={`${process.env.REACT_APP_BASE_URL}/${imageViewActive.dirName}${imageViewActive.AllImages[currIndex]}`} 
                    alt="Not Found" 
                    className='w-auto h-[90%] max-sm:w-[95%] max-sm:h-auto' 
                    loading='lazy'
                />
            </div>
        </div>
    );
}

export default ImageView;
