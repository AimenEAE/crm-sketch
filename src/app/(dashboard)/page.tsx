import { createClient } from "@/lib/supabase/server";
import { SalesFunnelChart } from "./_components/SalesFunnelChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// --- Placeholder Data Logic (Move to server action/API later) ---
// Ideally fetch this from DB
const placeholderCandidates = [
  { id: "cand_1", status: "Screening" },
  { id: "cand_2", status: "Interview" },
  { id: "cand_3", status: "New" },
  { id: "cand_4", status: "New" },
  { id: "cand_5", status: "Screening" },
  { id: "cand_6", status: "Rejected" },
  { id: "cand_7", status: "Offered" },
  { id: "cand_8", status: "New" },
];

// Placeholder for recent activities
const recentActivities = [
  { id: 1, type: "contact", action: "New contact created", name: "Sarah Johnson", time: "2 hours ago" },
  { id: 2, type: "candidate", action: "Status changed", name: "Michael Chen", time: "Yesterday", status: "Interview" },
  { id: 3, type: "organization", action: "New organization added", name: "Acme Corp", time: "2 days ago" },
  { id: 4, type: "candidate", action: "Status changed", name: "Eva Green", time: "3 days ago", status: "Offered" },
];

// Placeholder KPI data
const kpiData = {
  totalContacts: 126,
  contactsThisMonth: 14,
  totalOrganizations: 38,
  organizationsThisMonth: 3,
  totalCandidates: 87,
  candidatesThisMonth: 8,
};

const funnelStages = ['New', 'Screening', 'Interview', 'Offered', 'Rejected']; // Define order
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4842']; // Consistent colors

function processFunnelData(candidates: { status: string }[]) {
  const counts = candidates.reduce((acc, candidate) => {
    acc[candidate.status] = (acc[candidate.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Map to Recharts format, maintaining stage order and colors
  const funnelData = funnelStages
    .map((stage, index) => ({
      name: stage,
      value: counts[stage] || 0,
      fill: colors[index % colors.length],
    }))
    // Optionally filter out stages with 0 candidates if desired, except maybe the first stage
    // .filter((item, index) => item.value > 0 || index === 0);

  return funnelData;
}
// --- End Placeholder Data Logic ---

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Process the placeholder data
  const funnelData = processFunnelData(placeholderCandidates);

  return (
    <div className="py-6 space-y-6">
      {/* Welcome Bar */}
      <div className="bg-background p-4 rounded-lg border shadow-sm">
        <h2 className="text-2xl font-semibold">Welcome, {user?.email || 'User'}!</h2>
        <p className="text-muted-foreground">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{kpiData.totalContacts}</div>
              <Badge variant="outline" className="bg-blue-50">+{kpiData.contactsThisMonth} this month</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{kpiData.totalOrganizations}</div>
              <Badge variant="outline" className="bg-green-50">+{kpiData.organizationsThisMonth} this month</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{kpiData.totalCandidates}</div>
              <Badge variant="outline" className="bg-amber-50">+{kpiData.candidatesThisMonth} this month</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Funnel Chart - Takes 2/3 of the space on larger screens */}
        <div className="lg:col-span-2">
          <SalesFunnelChart data={funnelData} />
        </div>
        
        {/* Recent Activity - Takes 1/3 of the space */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    activity.type === 'candidate' ? 'bg-amber-500' : 
                    activity.type === 'organization' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.name}</p>
                    {activity.status && <Badge variant="outline" className="mt-1">{activity.status}</Badge>}
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <a href="/contacts/new" className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="text-sm font-medium">Add Contact</span>
            </a>
            
            <a href="/organizations/new" className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm font-medium">Add Organization</span>
            </a>
            
            <a href="/candidates/new" className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="text-sm font-medium">Add Candidate</span>
            </a>
            
            <a href="/reports" className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-medium">View Reports</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 