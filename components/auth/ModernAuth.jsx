"use client"
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import OtpVerify from '@components/OtpVerify'
import { useHomeContext } from '@contexts/HomeContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { hasPagePermission, hasPermission } from '@/lib/permissions'

function ModernAuth({ type, setAuthType }) {
  const router = useRouter()
  const [isOtpVerify, setIsOtpVerify] = useState(false)
  const { setActive, setUserDetails } = useHomeContext()
  const [otp, setOtp] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rEmail, setREmail] = useState('')
  const [username, setUsername] = useState('')
  const [rPassword, setRPassword] = useState('')

  const makeLogin = async () => {
    if (email === '' || password === '') {
      setError('Please enter all fields')
      return
    }

    setLoading(true)
    setError('')
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/authorization`, {
      email: email,
      password: password,
      action: 'login'
    })
      .then(res => {
        
        setIsLoggedIn(res.data)
        if (res.data.refreshToken) {
          Cookies.set('refreshToken', res.data.refreshToken, { expires: 7 })
        }
        if (res.data.accessToken) {
          Cookies.set('accessToken', res.data.accessToken, { expires: 1 })
        }
        if (res.data.userDetails) {
          Cookies.set('user', JSON.stringify(res.data.userDetails), { expires: 7 })
        }

        const redirectUrl = Cookies.get('redirectUrl')

        if (redirectUrl && !redirectUrl.includes('/authentication')) {
          Cookies.remove('redirectUrl')
          if(hasPagePermission(redirectUrl, 'R')) router.push(redirectUrl)
            else router.push('/learning')
        } else {
          Cookies.remove('redirectUrl')
          if (res.data.userDetails.role == "teacher") router.push('/teacher')
          else router.push('/learning')
        }
      })
      .catch(err => {
        console.log('error in sending request', err)
        setError('Login failed. Please check your credentials.')
      })
    // .finally(() => setLoading(false))
  }

  const makeRegisterPreload = async (e) => {
    e.preventDefault()

    if (username === '' || rEmail === '' || rPassword === '') {
      setError('Please enter all fields')
      return
    }

    setError('')
    setOtp(Math.floor(1000 + Math.random() * 9000))
  }

  const makeregister = async () => {
    setLoading(true)
    setError('')
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/authorization`, {
      username: username,
      email: rEmail,
      password: rPassword,
      action: 'register'
    })
      .then(res => {
        setIsLoggedIn(res.data)
        if (res.data.refreshToken) {
          Cookies.set('refreshToken', res.data.refreshToken, { expires: 7 })
        }
        if (res.data.accessToken) {
          Cookies.set('accessToken', res.data.accessToken, { expires: 1 })
        }
        if (res.data.userDetails) {
          Cookies.set('user', JSON.stringify(res.data.userDetails), { expires: 7 })
        }

        const redirectUrl = Cookies.get('redirectUrl')
        if (redirectUrl) {
          Cookies.remove('redirectUrl')
          router.push(redirectUrl)
        } else {
          router.push('/learning')
        }
      })
      .catch(err => {
        console.log('error in sending request', err)
        setError('Registration failed. Please try again.')
      })
    // .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (otp !== '') {
      emailjs.send("service_90isnjq", "template_gjxbssk", {
        to_name: username,
        message: otp,
        to_email: rEmail,
      }, { publicKey: '3T82ASRjzD5bj2PmC' })
        .then(() => {
          setIsOtpVerify(true)
        })
        .catch((error) => {
          console.log('FAILED...', error.text)
          setError('Failed to send OTP. Please try again.')
        })
    }
  }, [otp])

  useEffect(() => {
    if (type === 'login') {
      if (isLoggedIn.status === 'authorised') {
        setUserDetails(isLoggedIn)
        sessionStorage.setItem('userdetails', JSON.stringify(isLoggedIn))
        setActive('home')
      }
      else if (isLoggedIn.status === false) setError('Please register to login')
      else if (isLoggedIn.status === 'unauthorised') setError('Wrong email and password combination')
    }
    else if (type === 'register') {
      if (isLoggedIn.status === 'success') {
        setUserDetails(isLoggedIn)
        sessionStorage.setItem('userdetails', JSON.stringify(isLoggedIn))
        setActive('home')
      }
      else if (isLoggedIn.status === 'already exists') {
        setError('Email already exists')
        setIsOtpVerify(false)
        setREmail('')
        setRPassword('')
        setUsername('')
      }
      else if (isLoggedIn.status === false) {
        setError('Invalid email ID')
        setIsOtpVerify(false)
      }
    }
  }, [isLoggedIn])

  if (isOtpVerify) {
    return <OtpVerify otp={otp} setIsOtpVerify={setIsOtpVerify} makeregister={makeregister} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4 transition-colors-smooth">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary hover:bg-primary-600 transition-colors-fast rounded-full shadow-lg">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">SkillSphere</h1>
          <p className="text-muted-foreground mt-2">Learn and grow with us</p>
        </div>

        <Card className="shadow-xl border-border bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-card-foreground">
              {type === 'login' ? 'Welcome back' : 'Create account'}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {type === 'login'
                ? 'Enter your credentials to access your account'
                : 'Sign up to start your learning journey'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {type === 'login' ? (
              <form onSubmit={(e) => { e.preventDefault(); makeLogin(); }} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-card-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 transition-colors-fast"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-card-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 transition-colors-fast"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary-600 text-primary-foreground" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            ) : (
              <form onSubmit={makeRegisterPreload} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-card-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your full name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 transition-colors-fast"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-email" className="text-sm font-medium text-card-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={rEmail}
                      onChange={(e) => setREmail(e.target.value)}
                      className="pl-10 transition-colors-fast"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-password" className="text-sm font-medium text-card-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={rPassword}
                      onChange={(e) => setRPassword(e.target.value)}
                      className="pl-10 pr-10 transition-colors-fast"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary-600 text-primary-foreground" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {type === 'login' ? "Don't have an account? " : "Already have an account? "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-primary hover:text-primary-600"
                  onClick={() => setAuthType(type === 'login' ? 'register' : 'login')}
                >
                  {type === 'login' ? 'Sign up' : 'Sign in'}
                </Button>
              </p>
            </div>

            {type === 'register' && (
              <p className="text-xs text-muted-foreground text-center border-t border-border pt-4">
                By signing up, you agree to our Terms of Use and Privacy Policy.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ModernAuth