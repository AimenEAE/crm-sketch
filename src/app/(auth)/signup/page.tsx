'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import { createClient } from '@/lib/supabase/client' // REMOVED
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  // const supabase = createClient() // REMOVED

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    // const { error } = await supabase.auth.signUp({ // REMOVED
    //   email,
    //   password,
    //   // You might want to configure email verification redirects
    //   // options: {
    //   //   emailRedirectTo: `${location.origin}/auth/callback`,
    //   // },
    // }) // REMOVED

    // Since Supabase is removed, this is placeholder logic.
    console.log('Signup attempt with:', email);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Placeholder success/failure
    if (email && password.length >= 6) { // Basic validation
      setMessage('Signup successful! (Placeholder - No user created)')
      // You might want to redirect to login or clear the form
       router.push('/login'); // Redirect to login page
    } else if (password.length < 6) {
      setMessage('Signup failed: Password must be at least 6 characters (placeholder)')
    } else {
      setMessage('Signup failed: Please provide valid email and password (placeholder)')
    }

    // if (error) { // REMOVED
    //   setMessage(`Signup failed: ${error.message}`) // REMOVED
    // } else { // REMOVED
    //   setMessage('Signup successful! Please check your email for confirmation.') // REMOVED
    //   // Consider clearing the form or automatically redirecting after a delay
    // } // REMOVED
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6} // Enforce Supabase minimum password length
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            {message && (
              <p className={`text-sm ${message.startsWith('Signup failed') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing up...' : 'Create account'}
            </Button>
             <div className="mt-4 text-center text-sm">
               Already have an account?{" "}
               <Link href="/login" className="underline">
                 Sign in
               </Link>
             </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 