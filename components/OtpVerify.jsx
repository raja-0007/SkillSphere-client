import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { GraduationCap, Shield } from 'lucide-react'

function OtpVerify({otp,setIsOtpVerify, makeregister}) {
    const [otp2, setOtp2] = useState("")
    
    const handleClick = async() => {
        if(otp2!== ''){
          console.log(otp)
            if(otp2 == otp){
                makeregister()
            }
            else{
                alert("Wrong OTP entered. Please try again.")
                setIsOtpVerify(false)
            }
        }
        else{
            alert("Please enter the OTP to continue")
        }
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
          <p className="text-muted-foreground mt-2">Verify your account</p>
        </div>

        <Card className="shadow-xl border-border bg-card">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-2 bg-accent rounded-full">
                <Shield className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-card-foreground">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              We have sent a verification code to your email address. Please enter the 4-digit code to activate your account.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-card-foreground">Verification Code</label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 4-digit code"
                value={otp2}
                onChange={(e) => setOtp2(e.target.value)}
                className="text-center text-lg font-mono tracking-widest transition-colors-fast"
                maxLength={4}
                required
              />
            </div>
            
            <Button 
              type="button" 
              onClick={handleClick}
              className="w-full bg-primary hover:bg-primary-600 text-primary-foreground"
            >
              Verify Account
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-primary hover:text-primary-600"
                  onClick={() => setIsOtpVerify(false)}
                >
                  Go back
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OtpVerify
