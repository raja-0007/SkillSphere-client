import React, { useState } from 'react'

function OtpVerify({otp,setIsOtpVerify, makeregister}) {
    const [otp2, setOtp2] = useState("")
    
    const handleClick = async() => {
        if(otp2!== ''){
          console.log(otp)
            if(otp2 == otp){
                makeregister()
            }
            else{
                alert("wrong otp")
                setIsOtpVerify(false)
            }
        }
        else{
            alert("please enter otp")
        }
    }
  return (
    <div className='flex flex-col items-center w-[max-content] px-8'>
      <img src="/agro-logo-transparent.png" className='mb-3' width={'150px'} alt="" />
      <span>we have sent an otp to your email address</span>
      <span>Please enter the otp to activate your account</span>
      <input type="text" name="" id="" className='p-2 outline-none rounded-md text-center mt-2 mb-2' placeholder='Enter OTP'  maxLength={4} value={otp2} onChange={(e) => setOtp2(e.target.value)} />
      <button type='button' className='p-2 px-3 bg-red-400 hover:bg-red-500 rounded-lg text-white' onClick={handleClick}>verify</button>
    </div>
  )
}

export default OtpVerify
