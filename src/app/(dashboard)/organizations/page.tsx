'use client' // Convert to client component to handle state/actions

import { useState, useEffect } from 'react' // Import hooks
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateOrganizationDialog } from "./_components/CreateOrganizationDialog"
import { EditOrganizationDialog } from "./_components/EditOrganizationDialog" // Import Edit Dialog
import { EntityActions } from '../_components/EntityActions' // Import the actions component
import { LayoutGrid, List, Building2, Filter, Search, Download, Plus, ListFilter, Settings } from "lucide-react" // Import icons
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Interface for organization data
interface Organization {
  id: string;
  name: string;
  created_at: string; // Or Date if you prefer
}

// Placeholder data - moved inside component or fetched
const initialOrganizations: Organization[] = [
  { id: "org_1", name: "Tech Innovations Inc.", created_at: "2024-01-15" },
  { id: "org_2", name: "Marketing Solutions Ltd.", created_at: "2024-02-20" },
  { id: "org_3", name: "Global Logistics Co.", created_at: "2024-03-10" },
];

export default function OrganizationsPage() {
  // State to hold organizations data
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [loading, setLoading] = useState(false); // Example loading state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table'); // Default to table view
  const [searchQuery, setSearchQuery] = useState("");

  // --- Placeholder Data Refresh Function ---
  const refreshOrganizations = () => {
    console.log("Refreshing organizations data (placeholder)...");
    // setLoading(true);
    // In a real app, refetch data here
    // For now, just simulate adding/updating state if needed after create/edit
    // e.g., fetch().then(data => setOrganizations(data)).finally(() => setLoading(false));
  };

  // --- Action Handlers ---
  const handleEditOrganization = (id: string) => {
    const orgToEdit = organizations.find(org => org.id === id);
    if (orgToEdit) {
      setEditingOrganization(orgToEdit);
      setIsEditDialogOpen(true);
      console.log("Opening edit dialog for organization ID:", id);
    }
  };

  const handleDeleteOrganization = (id: string) => {
    console.log("Delete triggered for organization ID:", id);
    setOrganizations(prevOrgs => prevOrgs.filter(org => org.id !== id));
    console.log("Organization removed from local state (placeholder).");
    // TODO: Call actual delete API
  };
  // --- End Action Handlers ---

  // Load initial data and view mode preference
  useEffect(() => {
    // Load view mode from localStorage
    try {
      const savedViewMode = localStorage.getItem('org-view-mode');
      if (savedViewMode === 'card' || savedViewMode === 'table') {
        setViewMode(savedViewMode);
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
     
    // Placeholder: Fetch initial data
    // refreshOrganizations(); 
  }, []);

  // Toggle between view modes and save preference
  const toggleViewMode = () => {
    const newMode = viewMode === 'table' ? 'card' : 'table';
    setViewMode(newMode);
    
    // Save preference to localStorage
    try {
      localStorage.setItem('org-view-mode', newMode);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Filter organizations based on search query
  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-4">
      {/* SAP Fiori Style Header - Page Title and KPIs */}
      <div className="bg-white border-b mb-4 pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-[#0070f2]">Organizations</h2>
          <p className="text-sm text-muted-foreground">Manage your business accounts</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          <Card className="border-l-4 border-l-[#0070f2]">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Total</div>
              <div className="text-2xl font-semibold">{organizations.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Active</div>
              <div className="text-2xl font-semibold">{organizations.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Created This Month</div>
              <div className="text-2xl font-semibold">1</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SAP Fiori Style Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 mb-4 rounded-md border">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search organizations..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="h-10 gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="h-10 w-10 p-0"
            onClick={toggleViewMode}
            title={viewMode === 'table' ? "Switch to card view" : "Switch to table view"}
          >
            {viewMode === 'table' ? <LayoutGrid size={16} /> : <List size={16} />}
          </Button>
          <CreateOrganizationDialog onOrganizationCreated={refreshOrganizations}>
            <Button size="sm" className="h-10 gap-1 bg-[#0070f2] hover:bg-[#0058c4]">
              <Plus className="h-4 w-4" />
              <span>Add Organization</span>
            </Button>
          </CreateOrganizationDialog>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="px-2 py-1 text-xs gap-1 flex items-center">
          <span>Active</span>
          <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
        </Badge>
        <Badge variant="outline" className="px-2 py-1 text-xs gap-1 flex items-center">
          <span>Created: Last 30 days</span>
          <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
        </Badge>
        <Button variant="ghost" size="sm" className="text-xs h-6 gap-1">
          <ListFilter className="h-3 w-3" />
          <span>More filters</span>
        </Button>
      </div>

      {/* Content area with tabs */}
      {viewMode === 'table' ? (
        <Card className="overflow-hidden shadow-sm border-[#e5e5e5]">
          <div className="bg-[#f0f0f0] border-b border-[#e5e5e5] px-4 py-2 flex justify-between items-center">
            <div className="text-sm font-semibold text-[#333333]">All Organizations ({filteredOrganizations.length})</div>
            <Button variant="ghost" size="sm" className="h-7 gap-1">
              <Settings className="h-3 w-3" />
              <span className="text-xs">Customize</span>
            </Button>
          </div>
          <Table>
            <TableHeader className="bg-[#f7f7f7]">
              <TableRow>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Created At</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                   <TableCell colSpan={3} className="h-24 text-center">
                      Loading...
                   </TableCell>
                 </TableRow>
              ) : filteredOrganizations.length > 0 ? (
                filteredOrganizations.map((org) => (
                  <TableRow key={org.id} className="hover:bg-[#f8f9fb] border-b border-[#e5e5e5]">
                    <TableCell className="font-medium text-[#0070f2]">
                      <Link href={`/organizations/${org.id}`} className="hover:underline" title={`View details for ${org.name}`}>
                        {org.name}
                      </Link>
                    </TableCell>
                    <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                       <EntityActions
                         entityId={org.id}
                         entityType="organization"
                         onEdit={handleEditOrganization}
                         onDelete={handleDeleteOrganization}
                       />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No organizations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full h-32 flex items-center justify-center">
              Loading...
            </div>
          ) : filteredOrganizations.length > 0 ? (
            filteredOrganizations.map((org) => (
              <Card key={org.id} className="overflow-hidden border-[#e5e5e5] shadow-sm hover:shadow-md transition-shadow">
                {/* Make the main part of the card clickable */}
                <Link href={`/organizations/${org.id}`} className="block h-full">
                  <CardHeader className="pb-3 bg-[#f7f7f7] border-b border-[#e5e5e5]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-[#e6f2ff] text-[#0070f2]">
                        <Building2 size={18} />
                      </div>
                      <CardTitle className="text-base text-[#0070f2]">
                        {org.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">ID</span>
                        <span className="text-xs font-medium">{org.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Created</span>
                        <span className="text-xs font-medium">{new Date(org.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Status</span>
                        <span className="text-xs font-medium text-green-600">Active</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
                <CardFooter className="flex justify-end p-2 bg-[#f7f7f7] border-t border-[#e5e5e5]">
                  <EntityActions
                    entityId={org.id}
                    entityType="organization"
                    onEdit={handleEditOrganization}
                    onDelete={handleDeleteOrganization}
                  />
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full h-32 flex items-center justify-center text-muted-foreground">
              No organizations found.
            </div>
          )}
        </div>
      )}
      
      {/* Status Footer in SAP Fiori style */}
      <div className="mt-4 py-2 px-4 text-xs text-muted-foreground flex justify-between items-center border rounded bg-[#f7f7f7]">
        <div>
          Showing {filteredOrganizations.length} of {organizations.length} organizations
        </div>
        <div>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Edit Dialog - Rendered conditionally */}
      {editingOrganization && (
        <EditOrganizationDialog
           organization={editingOrganization}
           isOpen={isEditDialogOpen}
           onOpenChange={setIsEditDialogOpen}
           onOrganizationUpdated={() => {
               refreshOrganizations();
               setEditingOrganization(null); // Clear editing state
           }}
        />
      )}
    </div>
  )
} 