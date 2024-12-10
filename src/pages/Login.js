import React, { useContext, useEffect, useState } from 'react'
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { TiWarning } from "react-icons/ti";
import { MdReportGmailerrorred } from "react-icons/md";
import toast from 'react-hot-toast';
import { AppContext } from '../context/AppContext';
import MdLoader from '../components/spinner/MdLoader'

const Login = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const { AuthAdmin } = useContext(AppContext);
    const navigate = useNavigate();
    const [isVisiablePass, setIsVisiablePass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOTP, setIsLoadingOTP] = useState(false);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState({ error: false, message: '' });
    const [passwordError, setPasswordError] = useState({ error: false, message: '' });
    const [otpError, setOtpError] = useState({ error: false, message: '' });
    const [isVerifyOtp, setIsVerifyOtp] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [serverOpt, setServerOtp] = useState('');
    const [userToken, setUserToken] = useState('');
    const [user_id, setUser_id] = useState('');
    const [formData, setFormData] = useState({
        email:'',
        password:''
    });

    useEffect(() => {
        window.document.title = 'Vendor LogIn'
    },[]);

    useEffect(() => {
        AuthAdmin();
    },[])

    function inputHandler(event) {
        setError('');
        if (event.target.name === 'email') {
            setEmailError({ error: false, message: '' });
        }
        if (event.target.name === 'password') {
            setPasswordError({ error: false, message: '' });
        }
        if (event.target.name === 'otp') {
            setOtpCode(event.target.value);
            setOtpError({ error: false, message: '' });
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value
        }));
    }

    const isFormFilled = () => {
        return Object.values(formData).every(value => value.trim() !== '');
    };

    const loginHandler = async () => {
        if(!isFormFilled()){
            setError('Please fill out all fields.');
            return;
        }

        try {
            setIsLoading(true);
            const url = `${baseUrl}/vendor-login`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setUser_id(data.vendor_id);
                setUserToken(data.token);
                await verificationOtp(data.vendor_id);
                setIsVerifyOtp(true);
            } 
            else {
                if (data.tag === 'email') {
                    setEmailError({ error: true, message: data.message });
                } else if (data.tag === 'password') {
                    setPasswordError({ error: true, message: data.message });
                } else {
                    setError(data.message || 'An unexpected error occurred. Please try again.');
                }
            }
        } catch (err) {
            console.error('Error:', err.message);
            setError('Failed to sign in. Please check your network connection or try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    const verificationOtp = async (userId) => {
        try{
            setIsLoadingOTP(true)
            const url = `${baseUrl}/vendor-login/otp`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user_id:userId}),
            });
            const data = await response.json();

            if (response.ok && data.success === true) {
                setServerOtp(data.otp);
                toast.success(data.message);
            } 
            else {
                if (data.tag === 'email') {
                    setEmailError({ error: true, message: data.message });
                } else if (data.tag === 'password') {
                    setPasswordError({ error: true, message: data.message });
                } else {
                    setError(data.message || 'An unexpected error occurred. Please try again.');
                }
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to verify otp. Please check your network connection or try again later.');
        } finally {
            setIsLoadingOTP(false);
        }
    }

    const verifyOtp = async() => {
        try{
            setIsLoading(true);
            if((otpCode === serverOpt) && (userToken !== '')){
                localStorage.setItem('VideekVendor', userToken);
                await AuthAdmin();
                toast.success('Logged in successfully');
            }
            else{
                toast.error('wrong otp');
                setOtpError({error:true, message:'worng otp'});
            }
        }
        catch(err){
            setError(err.message);
        }
        finally{
            setIsLoading(false);
        }
    }

  return (
    <div className='w-full login min-h-screen bg-black flex flex-col items-center justify-center py-4'>
        <div className='w-[500px] flex flex-col text-white bg-[#111] py-6 px-8 max-sm:p-4 rounded-xl gap-6 max-sm:gap-4 max-md:w-[400px] max-sm:w-full'>
            <div className='w-full flex flex-col gap-1'>
                <h1 className='text-xl font-bold text-white max-md:text-lg'>{isVerifyOtp ? 'Verify Vendor' : 'Vendor-Login'}</h1>
                <p className='text-md font-semibold text-gray-400 max-md:text-sm'>{isVerifyOtp ? 'Check your email for the OTP' : 'Sign in to your account to continue'}</p>
            </div>

            <div className='w-full flex flex-col gap-6 max-md:gap-3'>
                {!isVerifyOtp && (<label className='w-full flex flex-col justify-start gap-2'>
                    <p className='w-full text-base font-semibold text-gray-500 max-md:text-sm'>Email address</p>
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={inputHandler}
                        placeholder='example@gmail.com'
                        className={`text-lg max-md:text-base font-semibold py-2 px-3 max-sm:px-2 bg-[#333] text-white placeholder:text-gray-500 rounded outline-none border-2 ${emailError.error ? 'border-red-500' : 'border-transparent transition duration-300 ease-in hover:border-blue-300 focus:border-blue-600'}`}
                    />
                    {
                        emailError.error && (
                            <div className='w-full flex items-center justify-start gap-2 text-red-500 text-sm font-medium max-sm:text-xs'>
                                <MdReportGmailerrorred className='text-lg max-sm:text-base text-orange-500' />
                                {emailError.message}
                            </div>
                        )
                    }
                </label>)}

                {!isVerifyOtp && (<label className='w-full flex flex-col relative gap-2'>
                    <div className='w-full flex items-center justify-between'>
                        <p className='text-base max-md:text-sm font-semibold text-gray-500'>Password</p>
                        <p onClick={() => navigate('/forgot-password')} className='text-md max-md:text-sm font-semibold text-blue-600 cursor-pointer transition duration-200 ease-in hover:underline'>Forgot Password?</p>
                    </div>
                    <input
                        type={isVisiablePass ? 'text' : 'password'}
                        name='password'
                        value={formData.password}
                        onChange={inputHandler}
                        placeholder='password'
                        className={`text-lg max-md:text-base font-semibold py-2 max-sm:px-2 pl-4 pr-12 bg-[#333] text-white placeholder:text-gray-500 rounded outline-none border-2 ${passwordError.error ? 'border-red-500' : 'border-transparent transition duration-300 ease-in hover:border-blue-300 focus:border-blue-600'}`}
                    />
                    <div className='absolute top-10 right-2 text-3xl max-md:text-xl cursor-pointer text-gray-500' onClick={() => setIsVisiablePass(!isVisiablePass)}>
                        {isVisiablePass ? (<IoMdEyeOff />) : (<IoMdEye />)}
                    </div>
                    {
                        passwordError.error && (
                            <div className='w-full flex items-center justify-start gap-2 text-red-500 text-sm font-medium max-sm:text-xs'>
                                <MdReportGmailerrorred className='text-lg text-orange-500' />
                                {passwordError.message}
                            </div>
                        )
                    }
                </label>)}

                {isVerifyOtp && (<label className='w-full flex flex-col gap-1'>
                    <p className='text-md max-md:text-sm font-semibold text-gray-500'>OTP</p>
                    <input
                        type='text'
                        name='otp'
                        value={otpCode}
                        onChange={inputHandler}
                        placeholder='enter otp'
                        className={`text-lg max-md:text-base max-sm:px-2 font-semibold py-2 px-4 bg-[#333] text-white placeholder:text-gray-500 rounded outline-none border-2 ${otpError.error ? 'border-red-500' : 'border-transparent transition duration-300 ease-in hover:border-blue-300 focus:border-blue-600'}`}
                    />
                    {
                        otpError.error && (
                            <div className='w-full flex items-center justify-start gap-2 text-red-500 text-sm font-medium max-sm:text-xs'>
                                <MdReportGmailerrorred className='text-lg text-orange-500' />
                                {otpError.message}
                            </div>
                        )
                    }
                </label>)}

                {error !== '' && (
                    <div className='w-full flex items-center justify-start gap-2 py-1 px-3 text-md max-md:text-sm max-sm:text-xs text-red-500 border border-red-500 font-semibold'>
                        <TiWarning className='text-xl max-md:lg text-orange-500' />
                        {error}
                    </div>
                )}

                {!isVerifyOtp && (<div className='w-full flex justify-start'>
                    <button className='text-lg w-[150px] h-[40px] max-md:text-base flex items-center justify-center gap-4 font-extrabold text-white border-2 border-blue-600 bg-blue-600 py-1 px-4 rounded-3xl transition duration-300 ease-in hover:bg-transparent' onClick={loginHandler}>{isLoading ? (<MdLoader/>) : 'Sign in'}</button>
                </div>)}

                {isVerifyOtp && (<div className='w-full flex justify-start items-center gap-4'>
                    <button className='tetext-lg w-[150px] h-[40px] max-md:text-base flex items-center justify-center gap-4 font-extrabold text-white border-2 border-orange-600 bg-orange-600 py-1 px-4 rounded-3xl transition duration-300 ease-in hover:bg-transparent' onClick={(() => verificationOtp(user_id)) }>{isLoadingOTP ? (<MdLoader/>): 'Resend'}</button>
                    <button className='text-lg w-[150px] h-[40px] max-md:text-base flex items-center justify-center gap-4 font-extrabold text-white border-2 border-blue-600 bg-blue-600 py-1 px-4 rounded-3xl transition duration-300 ease-in hover:bg-transparent' onClick={verifyOtp}>{isLoading ? (<MdLoader/>): 'Verify otp'}</button>
                </div>)}
            </div>
        </div>
    </div>
  )
}

export default Login