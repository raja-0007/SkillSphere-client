'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaTimesCircle, FaShoppingCart, FaHome, FaArrowLeft } from 'react-icons/fa'
import { MdCancel } from 'react-icons/md'

function PaymentCancelPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  // Handle countdown
  useEffect(() => {
    if (!shouldRedirect) {
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
  }, [shouldRedirect])

  // Separate effect for redirect
  useEffect(() => {
    if (shouldRedirect) {
      setIsRedirecting(true)
      router.push('/')
    }
  }, [shouldRedirect, router])

  const handleGoHome = () => {
    setShouldRedirect(true)
  }

  const handleGoToCart = () => {
    setIsRedirecting(true)
    router.push('/cart')
  }

  const handleGoBack = () => {
    setIsRedirecting(true)
    router.back()
  }

  return (
    <div className='flex min-h-screen w-full justify-center items-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden'>
      {/* Animated background circles */}
      <div className='absolute top-10 left-10 w-32 h-32 bg-red-200 rounded-full opacity-20 animate-pulse'></div>
      <div className='absolute bottom-10 right-10 w-40 h-40 bg-orange-200 rounded-full opacity-20 animate-pulse' style={{ animationDelay: '1s' }}></div>
      <div className='absolute top-1/3 right-1/4 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-pulse' style={{ animationDelay: '2s' }}></div>

      <div className='w-full max-w-lg mx-4 relative z-10'>
        <div className='bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center gap-6 border-4 border-red-300 animate-scale-in'>
          {/* Cancel Icon with Animation */}
          <div className='relative'>
            <div className='w-32 h-32 bg-red-100 rounded-full flex items-center justify-center animate-bounce-slow'>
              <MdCancel className='text-8xl text-red-500' />
            </div>
            <div className='absolute -top-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-ping'>
              <FaTimesCircle className='text-white text-2xl' />
            </div>
          </div>

          {/* Header */}
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-800 mb-3'>Payment Cancelled</h1>
            <p className='text-lg text-gray-600 mb-2'>Your transaction has been cancelled</p>
            <p className='text-sm text-gray-500'>No charges were made to your account</p>
          </div>

          {/* Info Card */}
          <div className='w-full bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6'>
            <div className='flex items-start gap-3 mb-4'>
              <div className='w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                <span className='text-white font-bold'>!</span>
              </div>
              <div>
                <h3 className='font-bold text-gray-800 mb-2'>Why was my payment cancelled?</h3>
                <ul className='text-sm text-gray-600 space-y-1'>
                  <li>• You clicked the cancel button</li>
                  <li>• You closed the payment window</li>
                  <li>• Session timeout occurred</li>
                </ul>
              </div>
            </div>

            <div className='bg-white rounded-lg p-4 border border-red-200'>
              <p className='text-sm text-gray-700'>
                <span className='font-semibold'>Don't worry!</span> Your items are still in your cart and you can complete the purchase anytime.
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className='w-full bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl p-6 text-center shadow-lg'>
            <p className='font-semibold mb-2'>Auto-redirecting to home page in</p>
            <div className='flex items-center justify-center gap-3'>
              <div className='w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center'>
                <span className='text-4xl font-bold animate-pulse'>{countdown}</span>
              </div>
              <span className='text-2xl font-semibold'>seconds</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='w-full flex flex-col gap-3'>
            <button
              onClick={handleGoToCart}
              disabled={isRedirecting}
              className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <FaShoppingCart className='text-xl' />
              Return to Cart
            </button>

            <button
              onClick={handleGoHome}
              disabled={isRedirecting}
              className='w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <FaHome className='text-xl' />
              Go to Home
            </button>

            <button
              onClick={handleGoBack}
              disabled={isRedirecting}
              className='w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <FaArrowLeft className='text-xl' />
              Go Back
            </button>
          </div>

          {/* Help Section */}
          <div className='w-full text-center pt-4 border-t border-gray-200'>
            <p className='text-sm text-gray-600'>
              Need help? 
              <button className='text-blue-600 font-semibold hover:underline ml-1'>
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default PaymentCancelPage