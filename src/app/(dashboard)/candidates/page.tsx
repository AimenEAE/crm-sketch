'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateCandidateDialog } from "./_components/CreateCandidateDialog"
import { EditCandidateDialog } from "./_components/EditCandidateDialog"
import { Badge } from "@/components/ui/badge"
import { EntityActions } from '../_components/EntityActions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

// Interface for candidate data
interface Candidate {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string; // Or Date
  position?: string;
  location?: string;
  source?: string;
}

// Placeholder data
const initialCandidates: Candidate[] = [
  { 
    id: "cand_1", 
    name: "Eva Green", 
    email: "eva.g@example.com", 
    status: "Screening", 
    created_at: "2024-04-01",
    position: "Frontend Developer",
    location: "New York",
    source: "LinkedIn"
  },
  { 
    id: "cand_2", 
    name: "Frank Wright", 
    email: "frank.w@sample.net", 
    status: "Interview", 
    created_at: "2024-04-05",
    position: "Backend Engineer",
    location: "San Francisco",
    source: "Referral"
  },
  { 
    id: "cand_3", 
    name: "Grace Hall", 
    email: "grace.h@mail.org", 
    status: "New", 
    created_at: "2024-04-07",
    position: "Product Manager",
    location: "Chicago",
    source: "Website"
  },
  { 
    id: "cand_4", 
    name: "David Chen", 
    email: "david.c@example.com", 
    status: "Offered", 
    created_at: "2024-03-28",
    position: "Data Scientist",
    location: "Boston",
    source: "Indeed"
  },
  { 
    id: "cand_5", 
    name: "Sarah Johnson", 
    email: "sarah.j@example.net", 
    status: "Rejected", 
    created_at: "2024-03-15",
    position: "UX Designer",
    location: "Seattle",
    source: "LinkedIn"
  },
];

// Helper to map status to badge variant
function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case 'new': return 'default';
    case 'screening': return 'secondary';
    case 'interview': return 'outline';
    case 'offered': return 'default';
    case 'rejected': return 'destructive';
    default: return 'secondary';
  }
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>(initialCandidates);
  const [loading, setLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Candidate>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // --- Status counts for header cards ---
  const statusCounts = candidates.reduce((acc, candidate) => {
    acc[candidate.status] = (acc[candidate.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // --- Placeholder Data Refresh ---
  const refreshCandidates = () => {
    console.log("Refreshing candidates data (placeholder)...");
    // setLoading(true);
    // fetch('/api/candidates').then(res => res.json()).then(data => setCandidates(data)).finally(() => setLoading(false));
  };

  // --- Action Handlers ---
  const handleEditCandidate = (id: string) => {
    const candidateToEdit = candidates.find(c => c.id === id);
    if (candidateToEdit) {
      setEditingCandidate(candidateToEdit);
      setIsEditDialogOpen(true);
      console.log("Opening edit dialog for candidate ID:", id);
    }
  };

  const handleDeleteCandidate = (id: string) => {
    console.log("Delete triggered for candidate ID:", id);
    setCandidates(prev => prev.filter(c => c.id !== id));
    console.log("Candidate removed from local state (placeholder).");
    // TODO: Call actual delete API
  };

  // --- Search and Filter ---
  useEffect(() => {
    let result = [...candidates];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.email.toLowerCase().includes(term) ||
        (c.position && c.position.toLowerCase().includes(term)) ||
        (c.location && c.location.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredCandidates(result);
  }, [candidates, searchTerm, statusFilter, sortField, sortDirection]);

  // --- Sort Handler ---
  const handleSort = (field: keyof Candidate) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // --- Fetch Data Effect ---
  useEffect(() => {
    // refreshCandidates();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className={`${statusFilter === 'all' ? 'bg-primary/5 border-primary' : ''}`}>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex justify-between">
              All <span>{candidates.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-3">
            <Button 
              variant={statusFilter === 'all' ? "default" : "ghost"}
              className="w-full text-xs h-7" 
              onClick={() => setStatusFilter('all')}
            >
              View
            </Button>
          </CardContent>
        </Card>
        
        <Card className={`${statusFilter === 'new' ? 'bg-primary/5 border-primary' : ''}`}>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex justify-between">
              New <span>{statusCounts['New'] || 0}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-3">
            <Button 
              variant={statusFilter === 'new' ? "default" : "ghost"}
              className="w-full text-xs h-7" 
              onClick={() => setStatusFilter('new')}
            >
              View
            </Button>
          </CardContent>
        </Card>
        
        <Card className={`${statusFilter === 'screening' ? 'bg-primary/5 border-primary' : ''}`}>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex justify-between">
              Screening <span>{statusCounts['Screening'] || 0}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-3">
            <Button 
              variant={statusFilter === 'screening' ? "default" : "ghost"}
              className="w-full text-xs h-7" 
              onClick={() => setStatusFilter('screening')}
            >
              View
            </Button>
          </CardContent>
        </Card>
        
        <Card className={`${statusFilter === 'interview' ? 'bg-primary/5 border-primary' : ''}`}>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex justify-between">
              Interview <span>{statusCounts['Interview'] || 0}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-3">
            <Button 
              variant={statusFilter === 'interview' ? "default" : "ghost"}
              className="w-full text-xs h-7" 
              onClick={() => setStatusFilter('interview')}
            >
              View
            </Button>
          </CardContent>
        </Card>
        
        <Card className={`${statusFilter === 'offered' ? 'bg-primary/5 border-primary' : ''}`}>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex justify-between">
              Offered <span>{statusCounts['Offered'] || 0}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-3">
            <Button 
              variant={statusFilter === 'offered' ? "default" : "ghost"}
              className="w-full text-xs h-7" 
              onClick={() => setStatusFilter('offered')}
            >
              View
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Candidates</CardTitle>
            <CreateCandidateDialog onCandidateCreated={refreshCandidates} />
          </div>
          
          {/* Search and Filter Bar */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input 
                type="search" 
                placeholder="Search candidates..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Settings
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </Button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <Tabs defaultValue="list" className="mt-4">
            <TabsList className="w-full bg-muted/50">
              <TabsTrigger value="list" className="flex-1">List View</TabsTrigger>
              <TabsTrigger value="board" className="flex-1">Board View</TabsTrigger>
              <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/70">
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                    <div className="flex items-center">
                      Email
                      {sortField === 'email' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('position')}>
                    <div className="flex items-center">
                      Position
                      {sortField === 'position' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('location')}>
                    <div className="flex items-center">
                      Location
                      {sortField === 'location' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Status
                      {sortField === 'status' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                    <div className="flex items-center">
                      Date Added
                      {sortField === 'created_at' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center">Loading...</TableCell></TableRow>
                ) : filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className="group hover:bg-muted/50">
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{candidate.position || '-'}</TableCell>
                      <TableCell>{candidate.location || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(candidate.status)}>{candidate.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(candidate.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <EntityActions
                          entityId={candidate.id}
                          entityType="candidate"
                          onEdit={handleEditCandidate}
                          onDelete={handleDeleteCandidate}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center">No candidates found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredCandidates.length}</span> of <span className="font-medium">{candidates.length}</span> candidates
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="bg-primary/10">1</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {editingCandidate && (
        <EditCandidateDialog
          candidate={editingCandidate}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onCandidateUpdated={() => {
              refreshCandidates();
              setEditingCandidate(null);
          }}
        />
      )}
    </div>
  )
} 