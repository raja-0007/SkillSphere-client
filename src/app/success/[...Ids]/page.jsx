"use client"

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState,  } from 'react'

function page({ params }) {
  // const {saveTransaction} = useHomeContext()
  // const {userDetails} = useHomeContext()
  const router = useRouter()
  const [userDetails, setUserDetails] = useState({})
  const [processing, setProcessing] = useState(true)
  const [status, setStatus] = useState(false)
  const Ids = params.Ids
  console.log(Ids)
  // const userDetails = JSON.parse(sessionStorage.getItem('userdetails'))
  // console.log(sessionStorage.getItem('userdetails'))
  // console.log(userDetails)

  const enroll = async (Ids) => {

    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/enroll`, { userId: userDetails?.userDetails?._id, courseIds: JSON.stringify(Ids) })
      .then(res => {
        console.log('enrolled', res.data);
        if (res.data.status == 'success') {
          return true
        }
        else return false
      })
  }
  useEffect(() => {

    // saveTransaction('transactions','success')
    // router.push('/')
    var status = false
    // console.log(userDetails)
    const getCart = async () => {
      const token = userDetails.token
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCart/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          console.log(res.data);
          res.data.cart.forEach(course => {

            status = enroll(course)
          });
          setProcessing(false)
          setStatus(status)
          setTimeout(() => {
            router.push('/')
          }, 1000);


        })
    }
    const startEnrolling=async()=>{
      

      status = enroll(Ids)
      
      setProcessing(false)
      setStatus(status)
      setTimeout(() => {
        router.push('/')
      }, 1000);
    }
    if (Object.keys(userDetails).length !== 0) {
      console.log('>>>>>>>>>>>>>>>>>>')
      // getCart()
      startEnrolling()
    }
    console.log('asdgaerwgq')
  }, [userDetails])



  useEffect(() => {
    const userData = sessionStorage.getItem('userdetails')
    console.log(sessionStorage.getItem('userdetails'))
    const getCart = async () => {
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/getCart/${userData?.userData?._id}`)
        .then(res => console.log(res.data))
    }

    // getCart()
    // router.push('/')
    console.log(JSON.parse(userData))
    setUserDetails(JSON.parse(userData))
  }, [])


  return (
    <div className='flex min-h-screen w-full justify-center items-center'>
      <div>
        {processing ?
          <>
            <div role="status">
              <svg aria-hidden="true" className="w-10 h-10 text-green-100 animate-spin  fill-green-600 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <p className='animate-pulse'>payment processing</p>
          </> : <>
            <p>payment {status ? <span className='font-bold text-green-400'>success</span> : <span className='font-bold text-red-400'>success</span>} </p>

            <p>redirecting to home page</p>
          </>
        }


      </div>
    </div>
  )
}

export default page
