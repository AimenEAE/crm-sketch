'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  Search, 
  Download, 
  Calendar, 
  User, 
  Users, 
  TrendingUp, 
  Check, 
  Target, 
  BarChart,
  ArrowUp,
  ArrowDown 
} from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/data-table/data-table"
import { LineChart } from "@/components/charts/line-chart"
import { BarChart as BarChartComponent } from "@/components/charts/bar-chart"
import { FeedbackToolbar } from "@/components/feedback"

// Types definition
interface PerformanceData {
  id: string;
  name: string;
  role: string;
  department: string;
  deals_closed: number;
  revenue_generated: number;
  conversion_rate: number;
  avg_deal_size: number;
  activities_completed: number;
  period: 'week' | 'month' | 'quarter';
  period_name: string;
  target_achievement: number;
  avatar: string;
}

interface TeamPerformance {
  id: string;
  name: string;
  members: number;
  deals_closed: number;
  revenue_generated: number;
  conversion_rate: number;
  avg_deal_size: number;
  target_achievement: number;
  growth: number;
}

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value);
};

// Format percentage
const formatPercent = (value: number) => {
  return `${Math.round(value)}%`;
};

// Placeholder data for individual performance
const individualPerformance: PerformanceData[] = [
  {
    id: 'emp_1',
    name: 'John Smith',
    role: 'Sales Representative',
    department: 'Enterprise Sales',
    deals_closed: 12,
    revenue_generated: 245000,
    conversion_rate: 28,
    avg_deal_size: 20416,
    activities_completed: 87,
    period: 'quarter',
    period_name: 'Q1 2024',
    target_achievement: 95,
    avatar: '/avatars/john.png'
  },
  {
    id: 'emp_2',
    name: 'Sarah Johnson',
    role: 'Account Executive',
    department: 'SMB Sales',
    deals_closed: 24,
    revenue_generated: 168000,
    conversion_rate: 32,
    avg_deal_size: 7000,
    activities_completed: 142,
    period: 'quarter',
    period_name: 'Q1 2024',
    target_achievement: 112,
    avatar: '/avatars/sarah.png'
  },
  {
    id: 'emp_3',
    name: 'Michael Chen',
    role: 'Sales Representative',
    department: 'Enterprise Sales',
    deals_closed: 8,
    revenue_generated: 320000,
    conversion_rate: 22,
    avg_deal_size: 40000,
    activities_completed: 65,
    period: 'quarter',
    period_name: 'Q1 2024',
    target_achievement: 85,
    avatar: '/avatars/michael.png'
  },
  {
    id: 'emp_4',
    name: 'Emily Rodriguez',
    role: 'Account Executive',
    department: 'SMB Sales',
    deals_closed: 18,
    revenue_generated: 90000,
    conversion_rate: 25,
    avg_deal_size: 5000,
    activities_completed: 110,
    period: 'quarter',
    period_name: 'Q1 2024',
    target_achievement: 78,
    avatar: '/avatars/emily.png'
  },
  {
    id: 'emp_5',
    name: 'David Wilson',
    role: 'Sales Manager',
    department: 'Enterprise Sales',
    deals_closed: 6,
    revenue_generated: 450000,
    conversion_rate: 40,
    avg_deal_size: 75000,
    activities_completed: 52,
    period: 'quarter',
    period_name: 'Q1 2024',
    target_achievement: 125,
    avatar: '/avatars/david.png'
  }
];

// Placeholder data for team performance
const teamPerformance: TeamPerformance[] = [
  {
    id: 'team_1',
    name: 'Enterprise Sales',
    members: 8,
    deals_closed: 42,
    revenue_generated: 1850000,
    conversion_rate: 26,
    avg_deal_size: 44047,
    target_achievement: 103,
    growth: 12
  },
  {
    id: 'team_2',
    name: 'SMB Sales',
    members: 12,
    deals_closed: 86,
    revenue_generated: 925000,
    conversion_rate: 31,
    avg_deal_size: 10755,
    target_achievement: 94,
    growth: 8
  },
  {
    id: 'team_3',
    name: 'Inside Sales',
    members: 6,
    deals_closed: 53,
    revenue_generated: 316000,
    conversion_rate: 22,
    avg_deal_size: 5962,
    target_achievement: 82,
    growth: -3
  }
];

// Monthly performance trend data
const monthlyTrend = [
  { month: 'Jan', revenue: 950000, deals: 62, target: 900000 },
  { month: 'Feb', revenue: 1050000, deals: 71, target: 1000000 },
  { month: 'Mar', revenue: 1100000, deals: 68, target: 1100000 },
  { month: 'Apr', revenue: 0, deals: 0, target: 1200000 } // Current month, no data yet
];

// Get badge variant for target achievement
function getAchievementBadgeVariant(achievement: number): "default" | "secondary" | "destructive" | "outline" {
  if (achievement >= 100) return "default";
  if (achievement >= 80) return "secondary";
  if (achievement >= 60) return "outline";
  return "destructive";
}

export default function PerformancePage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('quarter');
  const [view, setView] = useState<'individual' | 'team'>('individual');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof PerformanceData>('revenue_generated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filteredIndividuals, setFilteredIndividuals] = useState<PerformanceData[]>(individualPerformance);
  
  // Overall metrics calculation
  const overallMetrics = {
    totalRevenue: individualPerformance.reduce((sum, ind) => sum + ind.revenue_generated, 0),
    totalDeals: individualPerformance.reduce((sum, ind) => sum + ind.deals_closed, 0),
    avgDealSize: individualPerformance.reduce((sum, ind) => sum + ind.revenue_generated, 0) / 
                individualPerformance.reduce((sum, ind) => sum + ind.deals_closed, 0),
    avgConversionRate: individualPerformance.reduce((sum, ind) => sum + ind.conversion_rate, 0) / individualPerformance.length,
    topPerformer: individualPerformance.reduce((top, current) => 
                 (current.target_achievement > top.target_achievement) ? current : top, individualPerformance[0]),
    quarterlyTarget: 3100000,
    targetAchievement: Math.round((individualPerformance.reduce((sum, ind) => sum + ind.revenue_generated, 0) / 3100000) * 100)
  };

  // Filter and sort individuals
  useEffect(() => {
    let result = [...individualPerformance];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(person => 
        person.name.toLowerCase().includes(term) || 
        person.role.toLowerCase().includes(term) ||
        person.department.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortDirection === 'desc' ? -comparison : comparison;
      }
      
      return 0;
    });
    
    setFilteredIndividuals(result);
  }, [individualPerformance, searchTerm, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field: keyof PerformanceData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Column definitions for reps table
  const repsColumns = [
    {
      accessorKey: 'name',
      header: 'Sales Representative',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatar} alt={row.original.name} />
            <AvatarFallback>{row.original.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span>{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'deals',
      header: 'Deals Closed',
      cell: ({ row }: any) => (
        <span className="font-medium">{row.original.deals_closed}</span>
      ),
    },
    {
      accessorKey: 'revenue',
      header: 'Revenue Generated',
      cell: ({ row }: any) => (
        <span className="font-medium">{formatCurrency(row.original.revenue_generated)}</span>
      ),
    },
    {
      accessorKey: 'target',
      header: 'Target Completion',
      cell: ({ row }: any) => {
        const percentage = Math.round((row.original.revenue_generated / row.original.target_achievement) * 100);
        return (
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">{percentage}%</span>
              <span className="text-sm text-muted-foreground">{formatCurrency(row.original.revenue_generated)} / {formatCurrency(row.original.target_achievement)}</span>
            </div>
            <Progress value={percentage} className="h-2 w-full" />
          </div>
        );
      },
    },
    {
      accessorKey: 'conversion',
      header: 'Conversion Rate',
      cell: ({ row }: any) => (
        <span className="font-medium">{formatPercent(row.original.conversion_rate)}</span>
      ),
    }
  ];

  // Column definitions for teams table
  const teamsColumns = [
    {
      accessorKey: 'name',
      header: 'Team',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.original.name}</span>
          <Badge variant="outline">{row.original.members} members</Badge>
        </div>
      ),
    },
    {
      accessorKey: 'deals',
      header: 'Total Deals',
      cell: ({ row }: any) => <span>{row.original.deals_closed}</span>,
    },
    {
      accessorKey: 'revenue',
      header: 'Total Revenue',
      cell: ({ row }: any) => <span>{formatCurrency(row.original.revenue_generated)}</span>,
    },
    {
      accessorKey: 'target',
      header: 'Target Achievement',
      cell: ({ row }: any) => {
        const percentage = Math.round((row.original.revenue_generated / row.original.target_achievement) * 100);
        const color = percentage >= 100 ? 'text-green-600' : percentage >= 85 ? 'text-amber-600' : 'text-red-600';
        return (
          <div className="flex items-center gap-2">
            <span>{percentage}%</span>
            <span className={`flex items-center ${color}`}>
              {percentage >= 100 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {Math.abs(percentage - 100)}%
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'growth',
      header: 'YoY Growth',
      cell: ({ row }: any) => {
        const growth = row.original.growth;
        const color = growth > 0 ? 'text-green-600' : 'text-red-600';
        return (
          <span className={`flex items-center ${color}`}>
            {growth > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
            {Math.abs(growth)}%
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Performance Analytics</h1>
        <FeedbackToolbar />
      </div>

      {/* KPI Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overallMetrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 font-medium">+16%</span> from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Closed</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMetrics.totalDeals}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 font-medium">+12%</span> from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(overallMetrics.avgConversionRate)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 font-medium">+4.2%</span> from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overallMetrics.avgDealSize)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 font-medium">+8%</span> from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue performance for the current year</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <LineChart 
            data={monthlyTrend}
            xAxis="month"
            series={[{ name: 'revenue', label: 'Revenue' }]} 
            colors={['#3b82f6']}
            valueFormatter={(value: number) => formatCurrency(value)}
          />
        </CardContent>
      </Card>

      {/* View Toggle and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-md border">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search employees or teams..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={view === 'individual' ? 'default' : 'outline'} 
            size="sm" 
            className="h-10 gap-1"
            onClick={() => setView('individual')}
          >
            <User className="h-4 w-4" />
            <span>Individual</span>
          </Button>
          <Button 
            variant={view === 'team' ? 'default' : 'outline'} 
            size="sm" 
            className="h-10 gap-1"
            onClick={() => setView('team')}
          >
            <Users className="h-4 w-4" />
            <span>Team</span>
          </Button>
          <Button variant="outline" size="sm" className="h-10 gap-1">
            <Calendar className="h-4 w-4" />
            <span>Q1 2024</span>
          </Button>
          <Button variant="outline" size="sm" className="h-10 gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Performance Tables */}
      <Card className="overflow-hidden shadow-sm border-[#e5e5e5]">
        <Tabs defaultValue="performance" className="w-full">
          <div className="bg-[#f0f0f0] border-b border-[#e5e5e5] px-4 py-3 flex justify-between items-center">
            <div className="text-sm font-semibold text-[#333333]">
              {view === 'individual' ? 'Individual Performance' : 'Team Performance'}
            </div>
            <TabsList className="bg-transparent h-8 border">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="targets">Targets</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="performance" className="m-0">
            {view === 'individual' ? (
              <Table>
                <TableHeader className="bg-[#f7f7f7]">
                  <TableRow>
                    <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">
                        Name
                        {sortField === 'name' && (
                          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort('role')}>
                      <div className="flex items-center gap-1">
                        Role
                        {sortField === 'role' && (
                          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort('department')}>
                      <div className="flex items-center gap-1">
                        Department
                        {sortField === 'department' && (
                          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort('deals_closed')}>
                      <div className="flex items-center gap-1">
                        Deals
                        {sortField === 'deals_closed' && (
                          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold cursor-pointer text-right" onClick={() => handleSort('revenue_generated')}>
                      <div className="flex items-center gap-1 justify-end">
                        Revenue
                        {sortField === 'revenue_generated' && (
                          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort('avg_deal_size')}>
                      <div className="flex items-center gap-1">
                        Avg. Deal
                        {sortField === 'avg_deal_size' && (
                          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort('conversion_rate')}>
                      <div className="flex items-center gap-1">
                        Conv. Rate
                        {sortField === 'conversion_rate' && (
                          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort('target_achievement')}>
                      <div className="flex items-center gap-1">
                        Target %
                        {sortField === 'target_achievement' && (
                          <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIndividuals.map((individual) => (
                    <TableRow key={individual.id} className="hover:bg-[#f8f9fb] border-b border-[#e5e5e5]">
                      <TableCell className="font-medium text-[#0070f2]">
                        <a href={`/employees/${individual.id}`} className="hover:underline">
                          {individual.name}
                        </a>
                      </TableCell>
                      <TableCell>{individual.role}</TableCell>
                      <TableCell>{individual.department}</TableCell>
                      <TableCell>{individual.deals_closed}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(individual.revenue_generated)}
                      </TableCell>
                      <TableCell>{formatCurrency(individual.avg_deal_size)}</TableCell>
                      <TableCell>{formatPercent(individual.conversion_rate)}</TableCell>
                      <TableCell>
                        <Badge variant={getAchievementBadgeVariant(individual.target_achievement)}>
                          {formatPercent(individual.target_achievement)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredIndividuals.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        No employee data found matching your search
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader className="bg-[#f7f7f7]">
                  <TableRow>
                    <TableHead className="font-semibold">Team</TableHead>
                    <TableHead className="font-semibold">Members</TableHead>
                    <TableHead className="font-semibold">Deals</TableHead>
                    <TableHead className="font-semibold text-right">Revenue</TableHead>
                    <TableHead className="font-semibold">Avg. Deal</TableHead>
                    <TableHead className="font-semibold">Conv. Rate</TableHead>
                    <TableHead className="font-semibold">Target %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamPerformance.map((team) => (
                    <TableRow key={team.id} className="hover:bg-[#f8f9fb] border-b border-[#e5e5e5]">
                      <TableCell className="font-medium text-[#0070f2]">
                        <a href={`/teams/${team.id}`} className="hover:underline">
                          {team.name}
                        </a>
                      </TableCell>
                      <TableCell>{team.members}</TableCell>
                      <TableCell>{team.deals_closed}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(team.revenue_generated)}
                      </TableCell>
                      <TableCell>{formatCurrency(team.avg_deal_size)}</TableCell>
                      <TableCell>{formatPercent(team.conversion_rate)}</TableCell>
                      <TableCell>
                        <Badge variant={getAchievementBadgeVariant(team.target_achievement)}>
                          {formatPercent(team.target_achievement)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          
          <TabsContent value="targets" className="m-0 p-8 text-center text-muted-foreground">
            <p>Target achievement details will be displayed here</p>
          </TabsContent>
          
          <TabsContent value="activities" className="m-0 p-8 text-center text-muted-foreground">
            <p>Activity metrics will be displayed here</p>
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Status Footer */}
      <div className="mt-4 py-2 px-4 text-xs text-muted-foreground flex justify-between items-center border rounded bg-[#f7f7f7]">
        <div>
          {view === 'individual' ? 
            `Showing ${filteredIndividuals.length} of ${individualPerformance.length} employees` :
            `Showing ${teamPerformance.length} teams`
          }
        </div>
        <div>
          Last updated: {new Date().toISOString().split('T')[0]} {new Date().toLocaleTimeString('en-US')}
        </div>
      </div>
    </div>
  )
} 