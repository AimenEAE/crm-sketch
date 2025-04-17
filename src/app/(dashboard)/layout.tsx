// import { createClient } from '@/lib/supabase/server' // REMOVED
// import { redirect } from 'next/navigation' // No longer needed here
// import LogoutButton from './_components/LogoutButton' // No longer needed
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { FeedbackProvider, FeedbackOverlay } from '@/components/feedback'
import { cookies } from 'next/headers'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Create the Supabase client // REMOVED
  // const supabase = createClient() // REMOVED
  
  // Await the getUser call to ensure cookie operations are completed asynchronously // REMOVED
  // const { data: { user } } = await supabase.auth.getUser() // REMOVED
  
  // Since Supabase is removed, there's no user object.
  // We will remove UI elements that depended on it.
  const user = null; // Set user to null explicitly

  return (
    <FeedbackProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-white shadow-sm sm:flex">
          {/* Logo Area */}
          <div className="flex h-14 items-center border-b px-4">
            <span className="text-lg font-semibold text-primary">CRM Sketch</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-col gap-0.5 p-2">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
              Main Navigation
            </div>
            
            <Link href="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-primary bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            
            <Link href="/organizations" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Organizations
              <Badge variant="outline" className="ml-auto bg-blue-50">38</Badge>
            </Link>
            
            <Link href="/contacts" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Contacts
              <Badge variant="outline" className="ml-auto bg-green-50">126</Badge>
            </Link>
            
            <Link href="/candidates" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Candidates
              <Badge variant="outline" className="ml-auto bg-amber-50">87</Badge>
            </Link>
            
            <div className="mt-4 px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
              Reports
            </div>
            
            <Link href="/reports/sales" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Sales Pipeline
            </Link>
            
            <Link href="/reports/performance" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Performance
            </Link>
          </nav>
          
          {/* User Section - REMOVED */}
          {/* {user && ( // REMOVED
            <div className="mt-auto border-t p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">User</p>
                </div>
              </div>
            </div>
          )} // REMOVED */}
        </aside>

        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm lg:px-6">
            {/* Mobile menu button (hidden on desktop) */}
            <button className="rounded-md p-2 text-muted-foreground hover:bg-muted sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="sr-only">Toggle menu</span>
            </button>
            
            {/* Title (visible on mobile) */}
            <div className="font-semibold sm:hidden">CRM Sketch</div>
            
            {/* Search & Quick Actions */}
            <div className="mx-auto hidden w-full max-w-md sm:block">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="search" 
                  placeholder="Search..." 
                  className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                />
              </div>
            </div>
            
            {/* Header actions */}
            <div className="flex items-center gap-2">
              <button className="rounded-md p-2 text-muted-foreground hover:bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="sr-only">Notifications</span>
              </button>
              
              <button className="rounded-md p-2 text-muted-foreground hover:bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="sr-only">Settings</span>
              </button>
              
              {/* REMOVED User icon for mobile */}
              {/* {user && ( // REMOVED
                <button className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 sm:hidden">
                  <span className="text-sm font-medium text-primary">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </button>
              )} // REMOVED */}
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            {children}
          </main>
          
          {/* Feedback overlay */}
          <FeedbackOverlay />
        </div>
      </div>
    </FeedbackProvider>
  )
} 