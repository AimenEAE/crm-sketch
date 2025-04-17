'use client'

// import { createClient } from '@/lib/supabase/client' // REMOVED
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  // const supabase = createClient() // REMOVED
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    // await supabase.auth.signOut() // REMOVED
    
    // Placeholder: No actual logout happens since Supabase is removed.
    // You might want to redirect to login or home page.
    console.log('Logout clicked (placeholder)');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate action
    router.push('/login'); // Redirect to login page as a default action

    // router.refresh() // REMOVED - No session change
    // setLoading(false) // Might not be reached if refresh redirects immediately
    // setLoading(false) // Set loading false after action
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
      {loading ? 'Processing...' : 'Logout'} {/* Changed loading text */}
    </Button>
  )
} 