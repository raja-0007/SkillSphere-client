import { useHomeContext } from '@contexts/HomeContext'
import React from 'react'
import { FaTag } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { printRating } from '../home components/courses';
import { GoDotFill } from "react-icons/go";
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { IoChevronBackOutline } from 'react-icons/io5';


function Cart({ from, setFrom }) {
    const { cart, setCart, userDetails, logout, setActive } = useHomeContext()

    const getTotal = () => {
        var total = 0
        cart.forEach(element => {
            total += parseFloat(element.price)
        });
        return total
    }

    const checkOutHandler = async () => {
        if (getTotal() > 0) {

            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
            // if (!Object.values(details).includes('')) {
            // await axios.post('http://localhost:3000/api/payment', { name: details.name, amount: details.amount })
            //     .then((res) => console.log(res.data))
            console.log('payment', cart)
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/create-checkout-session`, { cart: JSON.stringify(cart), userId: userDetails?.userDetails?._id })

            const session = await response.data

            const result = stripe.redirectToCheckout({
                sessionId: session.id
            })

            if ((await result).error) {
                console.log(result.error)
            }
            // }
        }

    }

    const removeFromCart = async (Id) => {
        console.log(Id)
        try {
            const token = userDetails?.token;
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
        <div className='min-h-[80vh]'>
            <div className='px-40 mt-10 relative'>

                <p className='font-bold text-3xl'>Shopping Cart</p>
                {(from !== '') &&
                    <div className=" absolute top-[-40px] left-0 flex w-[max-content] cursor-pointer items-center font-bold py-3 text-gray-500" onClick={() => {setActive(from); setFrom('')}}>
                        <IoChevronBackOutline className='font-bold' />back to {from}
                    </div>
                }
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
                                            <span className='flex text-yellow-600 items-center font-bold text-sm'>{item.rating}{printRating(item.rating)}</span>
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
