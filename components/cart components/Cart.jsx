import { useHomeContext } from '@contexts/HomeContext'
import React, { useState } from 'react'
import { FaTag } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { printRating } from '../home components/courses';
import { GoDotFill } from "react-icons/go";
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';


function Cart({ from, setFrom }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const { cart, setCart, userDetails, logout, setActive } = useHomeContext()

    const getTotal = () => {
        var total = 0
        cart.forEach(element => {
            total += parseFloat(element.price)
        });
        return total
    }

    const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
    
    // const checkOutHandler = async () => {
    //     if (getTotal() > 0) {

    //         const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    //         // if (!Object.values(details).includes('')) {
    //         // await axios.post('http://localhost:3000/api/payment', { name: details.name, amount: details.amount })
    //         //     .then((res) => console.log(res.data))
    //         console.log('payment', cart)
    //         const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/create-checkout-session`, { cart: JSON.stringify(cart), userId: userDetails?.userDetails?._id })

    //         const session = await response.data

    //         const result = stripe.redirectToCheckout({
    //             sessionId: session.id
    //         })

    //         if ((await result).error) {
    //             console.log(result.error)
    //         }
    //         // }
    //     }

    // }

    const checkOutHandler = async () => {
        if (getTotal() > 0) {
            const totalAmount = getTotal(); // Convert to smallest currency unit (e.g., paise for INR)
            setLoading(true);
        
            // 1. Load Razorpay checkout.js script
            const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            if (!res) {
              alert("Razorpay SDK failed to load. Are you online?");
              setLoading(false);
              return;
            }
        
            try {
              // 2. Create order on your backend
              const { data: order } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/create-order`, {
                amount: totalAmount, // Example: ₹500
              });
        
              // 3. Configure options for Razorpay
              const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // public key
                amount: order.amount,
                currency: order.currency,
                name: "SkillSphere",
                description: "Test Transaction",
                order_id: order.id,
                handler: function (response) {
                  console.log("Payment Success:", response);
                  if(response.razorpay_payment_id){
                    router.push(`/success/${cart.map(item=>item._id)}`)
                  }
                  // 🔒 send response.razorpay_payment_id & response.razorpay_signature to backend for verification
                },
                prefill: {
                  name: "John Doe",
                  email: "john@example.com",
                  contact: "9876543210",
                },
                theme: {
                  color: "#3399cc",
                },
              };
        
              // 4. Open Razorpay popup
              const rzp = new window.Razorpay(options);
              rzp.open();
            } catch (err) {
              console.error("Error creating order:", err);
            }
        
            setLoading(false);
        }
  };

    const removeFromCart = async (Id) => {
        console.log(Id)
        try {
            const token = userDetails?.accessToken;
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/removeFromCart`, { courseId: Id, userId: userDetails.userDetails._id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    // console.log('added to cart', overviewCourse._id, res.data);
                    if (res.data.status == 'success') {
                        setCart(res.data.cart)

                    }

                })
        } catch (error) {
            if (error.response.status === 403) {
                alert('session expired please login again to continue')
                logout()
            }

            console.error('Error in removing cart item:', error);
        }
    }

    return (
        <div className='min-h-[80vh] relative'>
            {(from !== '') &&
                    <div className=" absolute top-3 left-2 flex w-[max-content] cursor-pointer items-center text-sm font-medium  text-gray-500" onClick={() => {setActive(from); setFrom('')}}>
                        <IoChevronBackOutline className='font-bold' />back to {from}
                    </div>
                }
            <div className='px-40 mt-10 '>

                <p className='font-bold text-3xl'>Shopping Cart</p>
                
            </div>
            <div className='px-40 mt-10 flex'>
                <div className='basis-3/4 pe-10'>

                    <div className='w-full border-b font-bold pb-1 '>{cart?.length} courses in cart</div>
                    {cart?.length > 0 ?

                        cart?.map((item, i) => {
                            const totalLectures = () => {
                                let total = 0
                                item.sections.forEach(sect => {
                                    total += sect.curriculum.length
                                });

                                return total
                            }
                            return (
                                <div key={i} className='flex p-3 border-b-2 justify-between'>

                                    <div className='flex gap-4'>
                                        <img src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${item.image}`} className='w-32 h-20' alt="" />
                                        <div className='flex flex-col gap-1'>
                                            <span className='font-bold'>{item.landingPageDetails.title}</span>
                                            <span className='capitalize text-sm'>By {item.author.username}</span>
                                            <span className='flex text-yellow-600 items-center font-bold text-sm'>{item.rating.rating}{printRating(item.rating.rating)}</span>
                                            <span className='flex items-center text-gray-600 text-sm'>{totalLectures()} lectures <GoDotFill className='text-xs mx-2' /> {item.landingPageDetails.level}</span>
                                        </div>
                                    </div>

                                    <span className='flex items-center justify-between w-[200px] h-[max-content] font-bold text-violet-500'>
                                        <div className='text-violet-500 w-[max-content]' >
                                            <span onClick={() => { removeFromCart(item._id); }}>remove</span>
                                        </div>
                                        <span className='flex items-center '><FaRupeeSign />{item.price}<FaTag className='ms-1' /></span>
                                    </span>
                                </div>
                            )
                        }) : <div className='w-full text-center py-36 font-bold text-2xl text-gray-300'>Add courses to buy</div>
                    }
                </div>
                <div className='basis-1/4 flex flex-col gap-3'>
                    <span className='text-gray-600 font-bold'>Total:</span>
                    <span className='text-3xl font-bold flex items-center'><FaRupeeSign />{getTotal()}</span>
                    <button type='button' className={`px-20 text-lg w-[max-content] py-2 ${getTotal() > 0 ? 'bg-violet-500' : 'bg-violet-200'}  text-white font-bold`} onClick={checkOutHandler}>checkout</button>
                </div>

            </div>
        </div>
    )
}

export default Cart
