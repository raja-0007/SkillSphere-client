
import axios from 'axios';

import React, { useEffect, useRef, useState } from 'react'
import { FaUserCircle } from "react-icons/fa";

import emailjs from '@emailjs/browser';
import OtpVerify from '@/components/OtpVerify';
import { TiWeatherPartlySunny } from "react-icons/ti";
import { GiFertilizerBag } from "react-icons/gi";
import { GiWheat } from "react-icons/gi";
import { GrPieChart } from "react-icons/gr";
import { useHomeContext } from '@/context/HomeContext';





function Authentication({ type,setAuthType }) {
  
  const regform = useRef()
  
  const [isOtpVerify, setIsOtpVerify] = useState(false)
  const {setActive, setUserDetails} = useHomeContext()
  const [otp, setOtp] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState({})
  const [isEmail, setIsEmail] = useState(false)
  const [isPword, setIsPword] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [isEmail2, setIsEmail2] = useState(false)
  const [isPword2, setIsPword2] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rEmail, setREmail] = useState('')
  const [username, setUsername] = useState('')
  const [rPassword, setRPassword] = useState('')
  const emailref = useRef(null)
  const pwordref = useRef(null)
  const userref = useRef(null)
  const emailref2 = useRef(null)
  const pwordref2 = useRef(null)
  // const [userdetails, setUserdetails] = useState({})
  const changeHandler = (e, num) => {
    switch (num) {
      case 1:
        setEmail(e.target.value)
        break;
      case 2:
        setPassword(e.target.value)

      default:
        break;
    }
  }
  const changeHandler2 = (e, num) => {
    switch (num) {
      case 1:
        setUsername(e.target.value)
        break;
      case 2:
        setREmail(e.target.value)
        break;
      case 3:
        setRPassword(e.target.value)

      default:
        break;
    }
  }

  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (emailref.current && !emailref.current.contains(e.target) && emailref.current.children[1].value === '') setIsEmail(false)

      if (pwordref.current && !pwordref.current.contains(e.target) && pwordref.current.children[1].value === '') setIsPword(false)

      if (emailref2.current && !emailref2.current.contains(e.target) && emailref2.current.children[1].value === '') setIsEmail2(false)

      if (pwordref2.current && !pwordref2.current.contains(e.target) && pwordref2.current.children[1].value === '') setIsPword2(false)

      if (userref.current && !userref.current.contains(e.target) && userref.current.children[1].value === '') setIsUser(false)




    })


    // setUserdetails(JSON.parse(sessionStorage.getItem('userdetails'))?.userDetails || '')

  }, [])

  useEffect(() => {
    console.log(email)
  }, [email])

  const makeLogin = async () => {
    console.log(email, password)
    if (email === '' || password === '') {
      alert('please enter all fields')
      return
    }
    await axios.post('http://localhost:7777/api/authorization', { email: email, password: password, action: 'login' })
      .then(console.log('req sent'))
      .then(res => { console.log(res.data); setIsLoggedIn(res.data) })

      .catch(err => console.log('error in sending request', err))
  }

  const makeRegisterPreload = async (e) => {
    e.preventDefault()
    // Math.floor(1000 + Math.random() * 9000) 
    
    console.log(username, rEmail, rPassword)
    if (username === '' || rEmail === '' || rPassword === '') {
      alert('please enter all fields')
      return
    }
    
    setOtp(Math.floor(1000 + Math.random() * 9000))
    
    

  }
  const makeregister = async () =>{
    await axios.post('http://localhost:7777/api/authorization', { username: username, email: rEmail, password: rPassword, action: 'register' })
      .then(res => setIsLoggedIn(res.data))
      .catch(err => console.log('error in sending request', err))
  }
  useEffect(()=>{
    if(otp !== ''){
      // makeregister()
      
      emailjs.send("service_90isnjq","template_gjxbssk",{
        to_name: username,
        message: otp,
        to_email: rEmail,
        },{publicKey: '3T82ASRjzD5bj2PmC'})
        .then(
          () => {
            console.log('SUCCESS!');
            setIsOtpVerify(true)
          },
          (error) => {
            console.log('FAILED...', error.text);
          },
        );
    }
  },[otp])
  useEffect(() => {

    console.log(type, isLoggedIn, isLoggedIn.token)
    if (type === 'login') {
      if (isLoggedIn.status === 'authorised') {
        setUserDetails(isLoggedIn)
        sessionStorage.setItem('userdetails', JSON.stringify(isLoggedIn))
        setActive('home')
        // router.push('/')
      }
      else if (isLoggedIn.status === false) alert('please register to login')
      else if (isLoggedIn.status === 'unauthorised') alert('wrong email and password combination')
    }
    else if (type === 'register') {
      if (isLoggedIn.status === 'success') {
        setUserDetails(isLoggedIn)
        sessionStorage.setItem('userdetails', JSON.stringify(isLoggedIn))
        setActive('home')
        // router.push('/')
      }
      else if (isLoggedIn.status === 'already exists') {
        alert('email already exists'); 
        setIsOtpVerify(false)
        setREmail('')
        setRPassword('')
        setUsername('')
        setIsUser(false)
        setIsEmail2(false)
        setIsPword2(false)
      }
      
      else if (isLoggedIn.status === false) {alert('invalid emailId'); setIsOtpVerify(false)}
    }

  }, [isLoggedIn])

  return (
    <div className=' flex flex-col relative'>
      {/* <img src="/home_bg3.jpg" className='absolute h-full z-0 w-full object-cover top-0' alt="" /> */}
      {/* <Navbar /> */}
      <section className='flex justify-evenly  items-center '>
        <div className={`py-10 my-5 px-5 z-10 flex items-center justify-center bg-white w-[max-content]  .shadow-md .shadow-gray-700 .bg-opacity-80`}>
          {!isOtpVerify ? 
          type == 'login' ?
            <div className='p-5 flex flex-col items-center justify-center gap-4'>

              <span className=' self-start text-md font-bold'>Login to your account</span>
              <span className='flex flex-col gap-2 justify-center items-center'>
                <FaUserCircle className='text-7xl text-slate-800' />
                <span className='text-sm font-light text-center '>
                  <p>
                    welcome to SkillSphere
                  </p>
                  
                </span>

              </span>

              <form className='flex flex-col gap-4'>

                <span ref={emailref}
                  className={`border-[1px] border-slate-800 bg-white bg-opacity-20 .shadow-sm .shadow-gray-400 ${isEmail ? 'rounded-md' : 'rounded-none'} flex flex-col cursor-text h-[55px] w-[350px] justify-center relative`}
                  onClick={() => { setIsEmail(true) }}>
                  <label
                    htmlFor='email'
                    className={`font-semibold cursor-text transition-all ease-in-out duration-300 absolute ${isEmail ? 'text-xs  transform -translate-y-[25px] left-0 rounded-full text-white border-[1px]  bg-slate-600 px-2' : 'text-md top-auto left-5 bottom-auto text-slate-800'}`} >
                    Email</label>

                  <input type="email"
                    value={email}
                    onChange={(e) => changeHandler(e, 1)}
                    placeholder={isEmail ? `enter email` : ''}
                    // ${isEmail ? '' : 'hidden'}
                    className={`outline-none transition-all bg-opacity-0 bg-white duration-200 w-full px-3 ease-in-out h-full`}
                    name="name1" id="email" />

                </span>
                <span ref={pwordref}
                  className={`border-[1px] border-slate-800 bg-white bg-opacity-20 .shadow-sm .shadow-gray-400 ${isPword ? 'rounded-md' : 'rounded-none'} flex flex-col cursor-text h-[55px] w-[350px] justify-center relative`}
                  onClick={() => setIsPword(true)}>
                  <label htmlFor='password'
                    className={`font-semibold cursor-text transition-all ease-in-out duration-300 absolute ${isPword ? 'text-xs transform -translate-y-[25px] left-0 rounded-full text-white border-[1px]  bg-slate-600 px-2' : 'text-md top-auto left-5 bottom-auto text-slate-800'}`} >
                    Password</label>
                  <input type="password"
                    value={password}
                    onChange={(e) => changeHandler(e, 2)}
                    placeholder={isPword ? `enter password` : ''}
                    className={`outline-none transition-all bg-opacity-0 bg-white duration-200 w-full px-3 ease-in-out h-full`}
                    name="" id="password" />

                </span>
                <button type='button' className='w-full bg-purple-600 text-center text-white font-bold py-3 mt-1 hover:bg-purple-700 transition-all duration-100' onClick={makeLogin}>Log in</button>
              </form>

              <span className='text-sm'>Don't have an account? <span  onClick={()=>setAuthType('register')} className='text-purple-700 cursor-pointer font-semibold underline-offset-2 underline'>Sign up</span></span>
            </div>
            : type == 'register' &&
            <div className='px-5 flex flex-col items-center justify-center gap-4'>

              <span className=' text-md self-start font-bold'>Signup and start learning</span>
              {/* <span className='flex flex-col gap-2 justify-center items-center'>
                <FaUserCircle className='text-7xl text-slate-800' />
                <span className='text-sm text-gray-500 text-center'>
                  <p>
                    welcome
                  </p>
                  <p className='font-semibold text-blue-300 '>
                    Crop Yield and Fertilizer Recommendation
                  </p>
                </span>
              </span> */}

              <form className='flex flex-col gap-4' ref={regform}>
                <span ref={userref}
                  className={`border-[1px] border-slate-800 bg-white bg-opacity-20 .shadow-sm .shadow-gray-400 ${isUser ? 'rounded-md' : 'rounded-none'} flex flex-col cursor-text h-[55px] w-[350px] justify-center relative`}
                  onClick={() => { setIsUser(true) }}>
                  <label htmlFor='username'
                    className={`font-semibold cursor-text transition-all ease-in-out duration-300 absolute ${isUser ? 'text-xs  transform -translate-y-[25px] left-0 rounded-full text-white border-[1px]  bg-slate-600 px-2' : 'text-md top-auto left-5 bottom-auto text-slate-800'}`} >
                    username</label>
                  <input type="text"
                    value={username}
                    onChange={(e) => changeHandler2(e, 1)}
                    className={`outline-none transition-all bg-opacity-0 bg-white duration-200 w-full px-3 ease-in-out h-full`}

                    name="to_name" id="username" />

                </span>
                <span ref={emailref2}
                  className={`border-[1px] border-slate-800 bg-white bg-opacity-20 .shadow-sm .shadow-gray-400 ${isEmail2 ? 'rounded-md' : 'rounded-none'} flex flex-col cursor-text h-[55px] w-[350px] justify-center relative`}
                  onClick={() => { setIsEmail2(true) }}>
                  <label htmlFor='email2'
                    className={`font-semibold cursor-text transition-all ease-in-out duration-300 absolute ${isEmail2 ? 'text-xs  transform -translate-y-[25px] left-0 rounded-full text-white border-[1px]  bg-slate-600 px-2' : 'text-md top-auto left-5 bottom-auto text-slate-800'}`} >
                    email</label>
                  <input type="email"
                    value={rEmail}
                    onChange={(e) => changeHandler2(e, 2)}
                    className={`outline-none transition-all bg-opacity-0 bg-white duration-200 w-full px-3 ease-in-out h-full`}
                    name="to_email" id="email2" />
                  <input type="text" value={'1234'} name="message" className='hidden' id="" />
                </span>
                <span ref={pwordref2}
                  className={`border-[1px] border-slate-800 bg-white bg-opacity-20 .shadow-sm .shadow-gray-400 ${isPword2 ? 'rounded-md' : 'rounded-none'} flex flex-col cursor-text h-[55px] w-[350px] justify-center relative`}
                  onClick={() => setIsPword2(true)}>
                  <label htmlFor='password2'
                    className={`font-semibold cursor-text transition-all ease-in-out duration-300 absolute ${isPword2 ? 'text-xs  transform -translate-y-[25px] left-0 rounded-full text-white border-[1px]  bg-slate-600 px-2' : 'text-md top-auto left-5 bottom-auto text-slate-800'}`} >
                    password</label>
                  <input type="password"
                    value={rPassword}
                    onChange={(e) => changeHandler2(e, 3)}
                    className={`outline-none transition-all bg-opacity-0 bg-white duration-200 w-full px-3 ease-in-out h-full`}
                    name="" id="password2" />

                </span>
                <button type='button' className='w-full bg-purple-600 text-white font-bold text-center py-3 mt-1 hover:bg-purple-700 transition-all duration-100' onClick={makeRegisterPreload}>Sign up</button>
              </form>
              <p className='text-xs py-2 border-b-[1px] border-gray-300 '>By signing up, you agree to our Terms of Use and Privacy Policy.</p>
              <span className='text-sm'>Already have an account? <span onClick={()=>setAuthType('login')} className='text-purple-700 cursor-pointer font-semibold underline-offset-2 underline'>log in</span></span>

            </div>
            :<OtpVerify otp={otp} setIsOtpVerify={setIsOtpVerify} makeregister={makeregister} />
            
          }
          
        </div>
        
        
        {/* <div className='z-10 flex flex-col gap-2 self-start mt-24 items-center justify-center'>
          <div className='flex flex-col gap-0 items-center justify-center'>
            <span className='text-9xl text-blue-400'>SkillSphere</span>
            <span className='font-semibold text-white px-4 py-1 bg-slate-400 rounded-full bg-opacity-50'>Crop Yield And Fertilizer Recommendation</span>
          </div>
          <div className='w-full flex flex-col gap-4 mt-5 items-center justify-center bg-slate-300 rounded-md bg-opacity-50 px-5 py-5'>
            <span className='text-gray-800 text-xl font-medium'>get instant and most accurate :</span>
            <div className=' text-gray-700 font-medium capitalize text-lg flex flex-col gap-4'>
              <span className='text-gray-700 flex gap-2 items-center justify-start'><GrPieChart size={'1.5em'} className='text-gray-800'/>crop yield prediction</span>
              <span className='text-gray-700 flex gap-2 items-center justify-start'><GiWheat size={'1.5em'} className='text-gray-800'/>crop recommendations</span>
              <span className='text-gray-700 flex gap-2 items-center justify-start'><GiFertilizerBag size={'1.5em'} className='text-gray-800'/> Fertilizer recommendations</span>
              <span className='text-gray-700 flex gap-2 items-center justify-start'><TiWeatherPartlySunny size={'1.5em'} className='text-gray-800'/> real time weather updates</span>
            </div>


          </div>

        </div> */}
      </section>
      {/* <Footer/> */}
      {/* <Footer/> */}
    </div>
  )
}

export default Authentication
