"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa'
import { MdCelebration } from 'react-icons/md'
import { useHomeContext } from '@contexts/HomeContext'

function PaymentSuccessPage({ params }) {
  const router = useRouter()
  const {userDetails, setUserDetails} = useHomeContext()
  const [processing, setProcessing] = useState(true)
  const [status, setStatus] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const Ids = params.Ids

  const enroll = async (courseIds) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userDetails?.userDetails?._id,
          courseIds: JSON.stringify(courseIds)
        })
      })
      
      const data = await response.json()
      return data.status === 'success'
    } catch (error) {
      console.error('Enrollment error:', error)
      return false
    }
  }

  // Handle enrollment
  useEffect(() => {
    const startEnrolling = async () => {
      if (!userDetails) return

      const enrollmentStatus = await enroll(Ids)
      setStatus(enrollmentStatus)
      setProcessing(false)
    }

    if (userDetails) {
      startEnrolling()
    }
  }, [userDetails, Ids])

  // Handle countdown and redirect
  useEffect(() => {
    if (!processing && !shouldRedirect) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setShouldRedirect(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [processing, shouldRedirect])

  // Separate effect for redirect
  useEffect(() => {
    if (shouldRedirect) {
      router.push('/')
    }
  }, [shouldRedirect, router])

  return (
    <div className='flex min-h-screen w-full justify-center items-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50'>
      <div className='w-full max-w-md mx-4'>
        {processing ? (
          <div className='bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center gap-6 animate-fade-in'>
            <div className='relative'>
              <div className='w-24 h-24 border-8 border-blue-200 border-t-blue-600 rounded-full animate-spin'></div>
              <FaSpinner className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-blue-600 animate-pulse' />
            </div>
            
            <div className='text-center'>
              <h2 className='text-2xl font-bold text-gray-800 mb-2'>Processing Payment</h2>
              <p className='text-gray-600 animate-pulse'>Please wait while we confirm your enrollment...</p>
            </div>

            <div className='flex gap-2'>
              <div className='w-3 h-3 bg-blue-600 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
              <div className='w-3 h-3 bg-purple-600 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
              <div className='w-3 h-3 bg-pink-600 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : (
          <div className={`bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center gap-6 animate-scale-in ${
            status ? 'border-4 border-green-400' : 'border-4 border-red-400'
          }`}>
            {status ? (
              <>
                <div className='relative'>
                  <div className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce-once'>
                    <FaCheckCircle className='text-6xl text-green-500' />
                  </div>
                  <MdCelebration className='absolute -top-2 -right-2 text-4xl text-yellow-500 animate-spin-slow' />
                </div>

                <div className='text-center'>
                  <h2 className='text-3xl font-bold text-gray-800 mb-2'>Payment Successful!</h2>
                  <p className='text-gray-600 mb-4'>Your enrollment has been confirmed</p>
                  
                  <div className='bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4'>
                    <p className='text-green-700 font-semibold'>
                      🎉 Welcome to your new courses!
                    </p>
                  </div>
                </div>

                <div className='w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 text-center'>
                  <p className='font-semibold'>Redirecting to home in</p>
                  <p className='text-4xl font-bold animate-pulse'>{countdown}s</p>
                </div>

                <div className='flex gap-3 w-full'>
                  <button
                    onClick={() => router.push('/my-courses')}
                    className='flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-all'
                  >
                    View My Courses
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className='flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all'
                  >
                    Go Home
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className='w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-shake'>
                  <FaTimesCircle className='text-6xl text-red-500' />
                </div>

                <div className='text-center'>
                  <h2 className='text-3xl font-bold text-gray-800 mb-2'>Payment Failed</h2>
                  <p className='text-gray-600 mb-4'>We couldn't process your enrollment</p>
                  
                  <div className='bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4'>
                    <p className='text-red-700 font-semibold'>
                      Please try again or contact support
                    </p>
                  </div>
                </div>

                <div className='w-full bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl p-4 text-center'>
                  <p className='font-semibold'>Redirecting in</p>
                  <p className='text-4xl font-bold animate-pulse'>{countdown}s</p>
                </div>

                <div className='flex gap-3 w-full'>
                  <button
                    onClick={() => router.push('/cart')}
                    className='flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all'
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className='flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all'
                  >
                    Go Home
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-bounce-once {
          animation: bounce-once 0.6s ease-in-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default PaymentSuccessPage