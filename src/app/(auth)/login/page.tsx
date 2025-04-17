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

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  // const supabase = createClient() // REMOVED

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    // const { error } = await supabase.auth.signInWithPassword({ // REMOVED
    //   email,
    //   password,
    // }) // REMOVED

    // Since Supabase is removed, this is placeholder logic.
    // You might want to implement a different auth mechanism or remove the form.
    console.log('Login attempt with:', email); // Keep for debugging
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // Placeholder success/failure
    if (email === "test@example.com" && password === "password") {
      setMessage('Login successful! Redirecting...') // Keep message for UX
      // router.refresh() // Removed as there's no session change
      // Redirect manually if needed, e.g., router.push('/dashboard')
       router.push('/') // Redirect to dashboard
    } else {
       setMessage('Login failed: Invalid credentials (placeholder)')
    }

    // if (error) { // REMOVED
    //   setMessage(`Login failed: ${error.message}`) // REMOVED
    // } else { // REMOVED
    //   setMessage('Login successful! Redirecting...') // REMOVED
    //   // Refresh the page to ensure server components reload with the new auth state
    //   // Middleware will handle the redirect if already logged in
    //   router.refresh() // REMOVED
    // } // REMOVED
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            {message && (
              <p className={`text-sm ${message.startsWith('Login failed') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign in'}
            </Button>
             <div className="mt-4 text-center text-sm">
               Don&apos;t have an account?{" "}
               <Link href="/signup" className="underline">
                 Sign up
               </Link>
             </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 