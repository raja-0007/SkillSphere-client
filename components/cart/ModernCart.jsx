"use client"
import { useHomeContext } from '@contexts/HomeContext'
import React, { useState } from 'react'
import { printRating } from '../home components/courses'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { ArrowLeft, ShoppingCart, Trash2, CreditCard, Tag, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

function ModernCart({ from, setFrom }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { cart, setCart, userDetails, logout, setActive } = useHomeContext()

    const getTotal = () => {
        return cart.reduce((total, item) => total + parseFloat(item.price), 0)
    }

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script")
            script.src = src
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const checkOutHandler = async () => {
        if (getTotal() > 0) {
            const totalAmount = getTotal()
            setLoading(true)
        
            const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
            if (!res) {
                alert("Razorpay SDK failed to load. Are you online?")
                setLoading(false)
                return
            }
        
            try {
                const { data: order } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/create-order`, {
                    amount: totalAmount,
                })
        
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: order.amount,
                    currency: order.currency,
                    name: "SkillSphere",
                    description: "Course Purchase",
                    order_id: order.id,
                    handler: function (response) {
                        if(response.razorpay_payment_id){
                            router.push(`/success/${cart.map(item=>item._id)}`)
                        }
                    },
                    prefill: {
                        name: userDetails?.userDetails?.username || "Student",
                        email: userDetails?.userDetails?.email || "student@example.com",
                        contact: "9876543210",
                    },
                    theme: {
                        color: "#8b5cf6",
                    },
                }
        
                const rzp = new window.Razorpay(options)
                rzp.open()
            } catch (err) {
                console.error("Error creating order:", err)
                alert("Payment failed. Please try again.")
            }
        
            setLoading(false)
        }
    }

    const removeFromCart = async (Id) => {
        try {
            const token = userDetails?.accessToken
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/removeFromCart`, { 
                courseId: Id, 
                userId: userDetails.userDetails._id 
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (res.data.status == 'success') {
                        setCart(res.data.cart)
                    }
                })
        } catch (error) {
            if (error.response?.status === 403) {
                alert('Session expired. Please login again to continue.')
                logout()
            }
            console.error('Error in removing cart item:', error)
        }
    }

    const getTotalLectures = (item) => {
        return item.sections.reduce((total, sect) => total + sect.curriculum.length, 0)
    }

    return (
        <div className='min-h-screen bg-gray-50 p-6'>
            <div className='max-w-7xl mx-auto'>
                {/* Header */}
                <div className='flex items-center gap-4 mb-8'>
                    {from !== '' && (
                        <Button 
                            variant="ghost" 
                            onClick={() => {setActive(from); setFrom('')}}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className='h-4 w-4' />
                            Back to {from}
                        </Button>
                    )}
                    <div className='flex items-center gap-3'>
                        <ShoppingCart className='h-8 w-8 text-primary' />
                        <h1 className='text-3xl font-bold'>Shopping Cart</h1>
                    </div>
                </div>

                <div className='grid lg:grid-cols-3 gap-8'>
                    {/* Cart Items */}
                    <div className='lg:col-span-2 space-y-4'>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <span>{cart?.length} {cart?.length === 1 ? 'course' : 'courses'} in cart</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {cart?.length > 0 ? (
                                    <div className='space-y-4'>
                                        {cart.map((item, i) => (
                                            <div key={i} className='flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow'>
                                                <img 
                                                    src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/images/${item.image}`} 
                                                    className='w-32 h-20 object-cover rounded-lg' 
                                                    alt={item.landingPageDetails.title} 
                                                />
                                                <div className='flex-1 space-y-2'>
                                                    <h3 className='font-semibold text-lg line-clamp-2'>
                                                        {item.landingPageDetails.title}
                                                    </h3>
                                                    <p className='text-sm text-muted-foreground'>
                                                        By {item.author.username}
                                                    </p>
                                                    <div className='flex items-center gap-4 text-sm'>
                                                        <div className='flex items-center gap-1'>
                                                            <span className='font-medium'>{item.rating.rating}</span>
                                                            <div className='flex'>{printRating(item.rating.rating)}</div>
                                                            <span className='text-muted-foreground'>
                                                                ({item.rating.TotalRatings || 0} ratings)
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                                                        <span>{getTotalLectures(item)} lectures</span>
                                                        <Badge variant="outline">{item.landingPageDetails.level}</Badge>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col items-end justify-between'>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                    <div className='flex items-center gap-1 text-lg font-bold text-primary'>
                                                        ₹{item.price}
                                                        <Tag className='h-4 w-4' />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='text-center py-16'>
                                        <ShoppingCart className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
                                        <h3 className='text-xl font-semibold mb-2'>Your cart is empty</h3>
                                        <p className='text-muted-foreground mb-6'>
                                            Browse our courses and add them to your cart to get started.
                                        </p>
                                        <Button onClick={() => router.push('/')}>
                                            Browse Courses
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className='space-y-4'>
                        <Card className='sticky top-6'>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='space-y-2'>
                                    <div className='flex justify-between text-sm'>
                                        <span>Subtotal ({cart?.length} {cart?.length === 1 ? 'item' : 'items'})</span>
                                        <span>₹{getTotal()}</span>
                                    </div>
                                    <div className='flex justify-between text-sm'>
                                        <span>Discount</span>
                                        <span className='text-green-600'>-₹0</span>
                                    </div>
                                    <hr />
                                    <div className='flex justify-between text-lg font-bold'>
                                        <span>Total</span>
                                        <span>₹{getTotal()}</span>
                                    </div>
                                </div>
                                
                                <Button 
                                    className='w-full' 
                                    size="lg"
                                    onClick={checkOutHandler}
                                    disabled={getTotal() === 0 || loading}
                                >
                                    <CreditCard className='h-4 w-4 mr-2' />
                                    {loading ? 'Processing...' : 'Checkout'}
                                </Button>
                                
                                <div className='text-center space-y-2'>
                                    <p className='text-xs text-muted-foreground'>
                                        30-day money-back guarantee
                                    </p>
                                    <p className='text-xs text-muted-foreground'>
                                        Full lifetime access
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModernCart