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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateContactDialog } from "./_components/CreateContactDialog"
import { EditContactDialog } from "./_components/EditContactDialog"
import { EntityActions } from '../_components/EntityActions'
import { LayoutGrid, List, User, Building2, Mail, Filter, Search, Download, Plus, ListFilter, Settings, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Interface for contact data
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationId: string;
  organization_name?: string;
  created_at: string;
}

// Placeholder data
const initialContacts: Contact[] = [
  { id: "cont_1", firstName: "Alice", lastName: "Smith", email: "alice.s@techinnovations.com", organizationId: "org_1", organization_name: "Tech Innovations Inc.", created_at: "2024-01-16" },
  { id: "cont_2", firstName: "Bob", lastName: "Johnson", email: "bob.j@marketingsolutions.com", organizationId: "org_2", organization_name: "Marketing Solutions Ltd.", created_at: "2024-02-21" },
  { id: "cont_3", firstName: "Charlie", lastName: "Brown", email: "charlie.b@globallogistics.com", organizationId: "org_3", organization_name: "Global Logistics Co.", created_at: "2024-03-11" },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [loading, setLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table'); // Default to table view
  const [searchQuery, setSearchQuery] = useState("");

  // --- Placeholder Data Refresh Function ---
  const refreshContacts = () => {
    console.log("Refreshing contacts data (placeholder)...");
    // setLoading(true);
    // fetch('/api/contacts').then(res => res.json()).then(data => setContacts(data)).finally(() => setLoading(false));
  };

  // --- Action Handlers ---
  const handleEditContact = (id: string) => {
    const contactToEdit = contacts.find(c => c.id === id);
    if (contactToEdit) {
      setEditingContact(contactToEdit);
      setIsEditDialogOpen(true);
      console.log("Opening edit dialog for contact ID:", id);
    }
  };

  const handleDeleteContact = (id: string) => {
    console.log("Delete triggered for contact ID:", id);
    setContacts(prev => prev.filter(c => c.id !== id));
    console.log("Contact removed from local state (placeholder).");
    // TODO: Call actual delete API
  };
  // --- End Action Handlers ---

  // Load initial data and view mode preference
  useEffect(() => {
    // Load view mode from localStorage
    try {
      const savedViewMode = localStorage.getItem('contact-view-mode');
      if (savedViewMode === 'card' || savedViewMode === 'table') {
        setViewMode(savedViewMode);
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
     
    // Placeholder: Fetch initial data
    // setLoading(true);
    // fetch('/api/contacts') // Example API endpoint
    //   .then(res => res.json())
    //   .then(data => { setContacts(data); setLoading(false); })
    //   .catch(error => { console.error("Failed to fetch contacts:", error); setLoading(false); });
  }, []);

  // Toggle between view modes and save preference
  const toggleViewMode = () => {
    const newMode = viewMode === 'table' ? 'card' : 'table';
    setViewMode(newMode);
    
    // Save preference to localStorage
    try {
      localStorage.setItem('contact-view-mode', newMode);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.organization_name && contact.organization_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="py-4">
      {/* SAP Fiori Style Header - Page Title and KPIs */}
      <div className="bg-white border-b mb-4 pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-[#0070f2]">Contacts</h2>
          <p className="text-sm text-muted-foreground">Manage all your business contacts</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          <Card className="border-l-4 border-l-[#0070f2]">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Total</div>
              <div className="text-2xl font-semibold">{contacts.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Active</div>
              <div className="text-2xl font-semibold">{contacts.length}</div>
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
            placeholder="Search contacts..." 
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
          <CreateContactDialog onContactCreated={refreshContacts}>
            <Button size="sm" className="h-10 gap-1 bg-[#0070f2] hover:bg-[#0058c4]">
              <Plus className="h-4 w-4" />
              <span>Add Contact</span>
            </Button>
          </CreateContactDialog>
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

      {/* Content area */}
      {viewMode === 'table' ? (
        <Card className="overflow-hidden shadow-sm border-[#e5e5e5]">
          <div className="bg-[#f0f0f0] border-b border-[#e5e5e5] px-4 py-2 flex justify-between items-center">
            <div className="text-sm font-semibold text-[#333333]">All Contacts ({filteredContacts.length})</div>
            <Button variant="ghost" size="sm" className="h-7 gap-1">
              <Settings className="h-3 w-3" />
              <span className="text-xs">Customize</span>
            </Button>
          </div>
          <Table>
            <TableHeader className="bg-[#f7f7f7]">
              <TableRow>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Organization</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell></TableRow>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id} className="hover:bg-[#f8f9fb] border-b border-[#e5e5e5]">
                    <TableCell className="font-medium text-[#0070f2]">
                      <Link href={`/contacts/${contact.id}`} className="hover:underline">
                        {contact.firstName} {contact.lastName}
                      </Link>
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>
                      {contact.organization_name ? (
                        <Link href={`/organizations/${contact.organizationId}`} className="hover:underline text-[#0070f2]">
                          {contact.organization_name}
                        </Link>
                      ) : (
                        contact.organizationId
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <EntityActions
                        entityId={contact.id}
                        entityType="contact"
                        onEdit={handleEditContact}
                        onDelete={handleDeleteContact}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No contacts found.
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
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <Card key={contact.id} className="overflow-hidden border-[#e5e5e5] shadow-sm hover:shadow-md transition-shadow">
                {/* Make the main part of the card clickable */}
                <Link href={`/contacts/${contact.id}`} className="block h-full">
                  <CardHeader className="pb-3 bg-[#f7f7f7] border-b border-[#e5e5e5]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-[#e6f2ff] text-[#0070f2]">
                        <User size={18} />
                      </div>
                      <CardTitle className="text-base text-[#0070f2]">
                        {contact.firstName} {contact.lastName}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-muted-foreground flex-shrink-0" />
                        <span className="truncate text-sm">{contact.email}</span>
                      </div>
                      {contact.organization_name && (
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-muted-foreground flex-shrink-0" />
                          <Link
                            href={`/organizations/${contact.organizationId}`}
                            className="truncate text-sm hover:underline text-[#0070f2]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {contact.organization_name}
                          </Link>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Not available</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
                <CardFooter className="flex justify-end p-2 bg-[#f7f7f7] border-t border-[#e5e5e5]">
                  <EntityActions
                    entityId={contact.id}
                    entityType="contact"
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                  />
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full h-32 flex items-center justify-center text-muted-foreground">
              No contacts found.
            </div>
          )}
        </div>
      )}
      
      {/* Status Footer in SAP Fiori style */}
      <div className="mt-4 py-2 px-4 text-xs text-muted-foreground flex justify-between items-center border rounded bg-[#f7f7f7]">
        <div>
          Showing {filteredContacts.length} of {contacts.length} contacts
        </div>
        <div>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Edit Dialog */}
      {editingContact && (
        <EditContactDialog
           contact={editingContact}
           isOpen={isEditDialogOpen}
           onOpenChange={setIsEditDialogOpen}
           onContactUpdated={() => {
               refreshContacts();
               setEditingContact(null);
           }}
        />
      )}
    </div>
  )
} 