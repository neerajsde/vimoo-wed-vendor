import React, { useContext, useEffect, useState } from 'react';
import { RiDeleteBin2Fill } from "react-icons/ri";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AppContext } from '../../context/AppContext';
import MdLoader from '../spinner/MdLoader';
import toast from 'react-hot-toast';
import axios from "axios"

const FAQs = () => {
    const {adminData} = useContext(AppContext);
    const [success, setSucsess] = useState("");
    const [error, setError] = useState("");
    const [addLoading, setAddLoading] = useState(false);
    const [question, setQuestion] = useState("");
    const [answere, setAnswere] = useState("");
    const [vendorData, setVendorData] = useState("");
    const [loader, setLoader] = useState([]);
    const [faqsData, setFaqsData] = useState([]);
    const [successArr, setSucsessArr] = useState([]);
    const [errorArr, setErrorArr] = useState([]);

    useEffect(() => {
        if (vendorData) {
            const newData = vendorData?.faqs.map((item) => ({
                id: item._id || '',
                question: item.question || '', 
                answere: item.answere || ''
            }));
            setFaqsData(newData);

            const loaders = vendorData?.faqs.map((item) => (
                false
            ));
            setLoader(loaders);

            const success = vendorData?.faqs.map((item) => (''));
            setSucsessArr(success);

            const error = vendorData?.faqs.map((item) => (''));
            setErrorArr(error);
        }
    }, [vendorData]);

    function inputHandler(name, index, value){
        setFaqsData((prevState) => {
            const currState = [...prevState];
            currState[index][name] = value;
            return currState; 
        })
    }
    

    const handleAnswereChange = (value) => {
        setAnswere(value);
    };

    const fetchVendorData = async () => {
        try {
            const token = localStorage.getItem('VideekVendor');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/vendor/${adminData.user_id}/faqs`, config);
            setVendorData(response.data.data);
        } catch (err) {
            toast.error(err.message)
        }
    };

    useEffect(() => {
        if(!vendorData && adminData.user_id){
            fetchVendorData();
        }
    },[adminData])

    const AddFAQsHandler = async (e) => {
        e.preventDefault();
        if(answere === ''){
            setSucsess("");
            setError("Please enter the answere");
            return;
        }
        try {
            setAddLoading(true);
            const token = localStorage.getItem("VideekVendor");
            if (!token) {
                throw new Error("Token not found. Please log in again.");
            }
            // Example of an async operation like submitting data
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/vendor/FAQ/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user_id: adminData.user_id,
                    question: question,
                    answere: answere
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to add FAQ.'); // Handle non-OK responses
            }
    
            const data = await response.json();
            if(data.success){
                setError("");
                setQuestion("");
                setAnswere("");
                setSucsess(data.message);
                fetchVendorData();
                toast.success(data.message);
            }
            else{
                setError(data.message);
                setSucsess("");
            }
        } catch (err) {
            setError(err.message);
            setSucsess("");
        } finally{
            setAddLoading(false);
        }
    };

    const updateHandler = async (index) => {
        if(faqsData[index].answere === ''){
            setSucsessArr((prevState) => {
                let curr = [...prevState];
                curr[index] = '';
                return curr;
            });
            setErrorArr((prevState) => {
                let curr = [...prevState];
                curr[index] = 'Please enter the answere';
                return curr;
            });
            return;
        }
        try {
            setLoader((prevState) => {
                let curr = [...prevState];
                curr[index] = true;
                return curr;
            });
            const token = localStorage.getItem("VideekVendor");
            if (!token) {
                throw new Error("Token not found. Please log in again.");
            }
            // Example of an async operation like submitting data
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/vendor/FAQ/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    vendor_id: adminData.user_id, 
                    faq_id: faqsData[index].id,
                    question: faqsData[index].question,
                    answere: faqsData[index].answere
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update FAQ.');
            }
    
            const data = await response.json();
            if(data.success){
                setSucsessArr((prevState) => {
                    let curr = [...prevState];
                    curr[index] = data.message;
                    return curr;
                });
                toast.success(data.message);
            }
            else{
                setErrorArr((prevState) => {
                    let curr = [...prevState];
                    curr[index] = data.message;
                    return curr;
                });
            }
        } catch (err) {
            setErrorArr((prevState) => {
                let curr = [...prevState];
                curr[index] = err.message;
                return curr;
            });
        } finally{
            setLoader((prevState) => {
                let curr = [...prevState];
                curr[index] = false;
                return curr;
            });
        }
    }

    const removeFAQHandler = async(indexToRemove) => {
        try {
            const token = localStorage.getItem("VideekVendor");
            if (!token) {
                throw new Error("Token not found. Please log in again.");
            }
            // Example of an async operation like submitting data
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/vendor/FAQ/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    vendor_id: adminData.user_id, 
                    faq_id: faqsData[indexToRemove].id
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update FAQ.');
            }
            const data = await response.json();
            if(data.success){
                let newArray = faqsData.filter((_, index) => index !== indexToRemove);
                setFaqsData(newArray);
                toast.success(data.message);
            }
            else{
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message)
        }
    }
    
  return (
    <div className='w-full flex flex-col gap-8 px-4'>
        <h2 className='text-2xl text-cyan-600 font-bold'>Add New FAQ</h2>

        <form onSubmit={AddFAQsHandler} className='w-full flex flex-col bg-[#000] border border-[#333] p-4 gap-4'>
            <div className="w-full flex justify-start items-center gap-2">
                <label className="text-gray-400 text-lg font-medium">Question:</label>
                <input
                    type="text"
                    name="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    placeholder="write question for FAQ"
                    className="w-full py-2 px-4 bg-[#111] border placeholder:text-gray-700 border-[#333] outline-none text-lg text-white focus:border-yellow-600 rounded-sm"
                />
            </div>
            <div className="w-full flex flex-col gap-1">
                <label className="text-gray-400 text-base font-medium">
                    Answere
                </label>
                <ReactQuill
                    value={answere}
                    onChange={handleAnswereChange}
                    className="text-white bg-[#111]"
                />
            </div>
            <div className='w-full flex justify-start items-center gap-4'>
                <button type='submit' className="h-[40px] w-[100px] rounded-sm flex justify-center items-center py-2 px-4 border-none outline-none text-lg text-white bg-cyan-600 transition duration-200 ease-in hover:bg-cyan-800">{ addLoading ? (<MdLoader/>) : 'Add'}</button>
                {
                    success && (<p className='text-base text-green-500 font-semibold'>{success}</p>)
                }

                {
                    error && (<p className='text-base text-red-500 font-semibold'>{error}</p>)
                }
            </div>
        </form>

        <h2 className='text-2xl text-orange-300 text-center font-bold py-2 bg-[#222]'>All FAQs, Update Or Delete</h2>

        <div className='w-full flex flex-col gap-4'>
            {
                faqsData && faqsData.map((item, index) => (
                    <div key={index} className='w-full flex flex-col bg-[#000] border border-yellow-300 p-4 gap-4'>
                        <div className="w-full flex flex-col gap-2">
                            <div className='w-full flex justify-between items-end'>
                                <label className="text-gray-400 text-base font-medium">Question</label>
                                <div className='flex justify-start items-center gap-4'>
                                    <button onClick={() => removeFAQHandler(index)} className='py-1 px-2 border border-red-500 text-red-500 text-base font-semibold bg-white flex items-center justify-center gap-2 rounded transition duration-200 ease-in hover:bg-red-500 hover:text-white'>
                                        <RiDeleteBin2Fill/> Remove
                                    </button>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={faqsData[index].question}
                                onChange={(e) => inputHandler('question', index, e.target.value)}
                                required
                                placeholder="write question for FAQ"
                                className="w-full py-2 px-4 bg-[#111] border placeholder:text-gray-700 border-[#333] outline-none text-lg text-white focus:border-yellow-600 rounded-sm"
                            />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <label className="text-gray-400 text-base font-medium">
                                Answere
                            </label>
                            <ReactQuill
                                value={faqsData[index].answere}
                                onChange={(value) => inputHandler('answere', index, value)}
                                className="text-white bg-[#111]"
                            />
                        </div>
                        <div className='w-full flex justify-start items-center gap-4'>
                            <button onClick={() => updateHandler(index)} className="h-[40px] w-[100px] rounded-sm flex justify-center items-center py-2 px-4 border-none outline-none text-lg text-white bg-cyan-600 transition duration-200 ease-in hover:bg-cyan-800">{ loader[index] ? (<MdLoader/>): 'Update'}</button>
                            {
                                successArr[index] && (<p className='text-base text-green-500 font-semibold'>{successArr[index]}</p>)
                            }

                            {
                                errorArr[index] && (<p className='text-base text-red-500 font-semibold'>{errorArr[index]}</p>)
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default FAQs