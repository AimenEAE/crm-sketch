'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft, Building2, CalendarDays, Users2, PlusCircle, ExternalLink, Edit, Mail, Phone, MapPin, Activity, ChevronRight, User, Settings2 } from "lucide-react";
import { EditOrganizationDialog } from "../_components/EditOrganizationDialog";

// Define interface for contact and organization data
interface Contact {
    id: string;
    name: string;
    title?: string;
}

interface Organization {
    id: string;
    name: string;
    created_at: string;
    website?: string;
    address?: string;
    contacts?: Contact[];
}

// Placeholder fetch function
async function getOrganizationDetails(id: string): Promise<Organization | null> {
    console.log("Fetching details for org ID (placeholder):", id);
    // Simulate fetching - replace with actual DB call
    await new Promise(resolve => setTimeout(resolve, 300));
    // Find from initial data or return a default structure
    const orgs = [
        { 
            id: "org_1", 
            name: "Tech Innovations Inc.", 
            created_at: "2024-01-15", 
            website: "https://techinnovations.example.com",
            address: "123 Tech Park, San Francisco, CA 94107",
            contacts: [{id: "c1", name: "Alice Smith", title: "CTO"}, {id: "c2", name: "David Lee", title: "VP of Sales"}]
        },
        { 
            id: "org_2", 
            name: "Marketing Solutions Ltd.", 
            created_at: "2024-02-20", 
            website: "https://marketingsolutions.example.com",
            address: "456 Market St, New York, NY 10001",
            contacts: [{id: "c3", name: "Bob Johnson", title: "Marketing Director"}]
        },
        { 
            id: "org_3", 
            name: "Global Logistics Co.", 
            created_at: "2024-03-10", 
            website: "https://globallogistics.example.com",
            address: "789 Shipping Lane, Miami, FL 33101",
            contacts: [{id: "c4", name: "Charlie Brown", title: "Operations Manager"}]
        },
    ];
    const org = orgs.find(o => o.id === id);
    if (!org) return null; // Or throw an error for not found
    return org;
}

interface PageProps {
    params: { orgId: string };
}

export default function OrganizationDetailPage({ params }: PageProps) {
    const { orgId } = params;
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Load organization data
    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const data = await getOrganizationDetails(orgId);
                setOrganization(data);
            } catch (error) {
                console.error("Error fetching organization:", error);
            } finally {
                setIsLoading(false);
            }
        }
        
        loadData();
    }, [orgId]);

    // Handle organization update
    const handleOrganizationUpdated = async () => {
        // In a real app, refetch the data
        setIsLoading(true);
        try {
            const refreshedData = await getOrganizationDetails(orgId);
            setOrganization(refreshedData);
            console.log("Organization data refreshed after update");
        } catch (error) {
            console.error("Error refreshing organization data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="py-4">
                <div className="flex items-center gap-2 mb-4">
                    <Link href="/organizations" className="text-sm text-[#0070f2] hover:underline inline-flex items-center">
                        <ArrowLeft size={14} className="mr-1" /> Back to Organizations
                    </Link>
                    <ChevronRight size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
                <div className="bg-white p-8 border rounded-md flex items-center justify-center">
                    Loading organization details...
                </div>
            </div>
        );
    }

    if (!organization) {
        return (
            <div className="py-4">
                <div className="flex items-center gap-2 mb-4">
                    <Link href="/organizations" className="text-sm text-[#0070f2] hover:underline inline-flex items-center">
                        <ArrowLeft size={14} className="mr-1" /> Back to Organizations
                    </Link>
                </div>
                <div className="bg-white p-8 border rounded-md flex items-center justify-center">
                    Organization not found.
                </div>
            </div>
        );
    }

    return (
        <div className="py-4 space-y-4">
            {/* SAP Fiori Style Breadcrumb */}
            <div className="flex items-center gap-2 mb-2">
                <Link href="/organizations" className="text-sm text-[#0070f2] hover:underline inline-flex items-center">
                    <ArrowLeft size={14} className="mr-1" /> Organizations
                </Link>
                <ChevronRight size={14} className="text-muted-foreground" />
                <span className="text-sm font-medium">{organization.name}</span>
            </div>

            {/* SAP Fiori Style Header with Object Status */}
            <div className="bg-white border rounded-md">
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#e6f2ff] text-[#0070f2]">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-[#333333]">{organization.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-2">
                                    Active
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    ID: {organization.id}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex mt-4 md:mt-0 gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsEditDialogOpen(true)}
                            className="gap-1"
                        >
                            <Edit size={14} />
                            <span>Edit</span>
                        </Button>
                        <Button 
                            size="sm"
                            className="gap-1 bg-[#0070f2] hover:bg-[#0058c4]"
                        >
                            <Activity size={14} />
                            <span>Actions</span>
                        </Button>
                    </div>
                </div>

                {/* SAP Fiori Style Tabs */}
                <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                    <div className="border-b">
                        <TabsList className="bg-transparent h-12 p-0 w-full flex justify-start">
                            <TabsTrigger 
                                value="overview" 
                                className={`px-4 rounded-none border-b-2 ${activeTab === 'overview' ? 'border-[#0070f2] text-[#0070f2]' : 'border-transparent'} data-[state=active]:bg-white data-[state=active]:shadow-none`}
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger 
                                value="contacts" 
                                className={`px-4 rounded-none border-b-2 ${activeTab === 'contacts' ? 'border-[#0070f2] text-[#0070f2]' : 'border-transparent'} data-[state=active]:bg-white data-[state=active]:shadow-none`}
                            >
                                Contacts
                            </TabsTrigger>
                            <TabsTrigger 
                                value="activities" 
                                className={`px-4 rounded-none border-b-2 ${activeTab === 'activities' ? 'border-[#0070f2] text-[#0070f2]' : 'border-transparent'} data-[state=active]:bg-white data-[state=active]:shadow-none`}
                            >
                                Activities
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    
                    <TabsContent value="overview" className="p-4 bg-[#f7f7f7]">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Main organization details card */}
                            <div className="lg:col-span-2 space-y-4">
                                <Card className="border-[#e5e5e5] shadow-sm">
                                    <CardHeader className="pb-2 bg-white flex justify-between items-center border-b border-[#e5e5e5]">
                                        <CardTitle className="text-base">Organization Details</CardTitle>
                                        <Button variant="ghost" size="sm" className="h-7 gap-1">
                                            <Settings2 size={12} />
                                            <span className="text-xs">Customize</span>
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <h4 className="text-xs text-muted-foreground uppercase font-semibold">Name</h4>
                                                <p className="text-sm">{organization.name}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-xs text-muted-foreground uppercase font-semibold">Created</h4>
                                                <p className="text-sm">{new Date(organization.created_at).toLocaleDateString()}</p>
                                            </div>
                                            {organization.address && (
                                                <div className="space-y-1 col-span-2">
                                                    <h4 className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">
                                                        <MapPin size={12} /> Address
                                                    </h4>
                                                    <p className="text-sm">{organization.address}</p>
                                                </div>
                                            )}
                                            {organization.website && (
                                                <div className="space-y-1 col-span-2">
                                                    <h4 className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">
                                                        <ExternalLink size={12} /> Website
                                                    </h4>
                                                    <a 
                                                        href={organization.website} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-[#0070f2] hover:underline"
                                                    >
                                                        {organization.website}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-[#e5e5e5] shadow-sm">
                                    <CardHeader className="pb-2 bg-white flex justify-between items-center border-b border-[#e5e5e5]">
                                        <CardTitle className="text-base">Recent Activities</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="text-center text-sm text-muted-foreground py-8">
                                            No recent activities found.
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Side panel with KPIs and related data */}
                            <div className="space-y-4">
                                <Card className="border-[#e5e5e5] shadow-sm">
                                    <CardHeader className="pb-2 bg-white border-b border-[#e5e5e5]">
                                        <CardTitle className="text-base">Key Metrics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="grid grid-cols-1 divide-y">
                                            <div className="p-4 flex justify-between items-center">
                                                <div className="text-sm">Contacts</div>
                                                <div className="text-lg font-semibold">{organization.contacts?.length || 0}</div>
                                            </div>
                                            <div className="p-4 flex justify-between items-center">
                                                <div className="text-sm">Open Activities</div>
                                                <div className="text-lg font-semibold">0</div>
                                            </div>
                                            <div className="p-4 flex justify-between items-center">
                                                <div className="text-sm">Last Updated</div>
                                                <div className="text-sm text-muted-foreground">Today</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-[#e5e5e5] shadow-sm">
                                    <CardHeader className="pb-2 bg-white border-b border-[#e5e5e5]">
                                        <CardTitle className="text-base">Key Contacts</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {organization.contacts && organization.contacts.length > 0 ? (
                                            <div className="divide-y">
                                                {organization.contacts.slice(0, 2).map((contact) => (
                                                    <div key={contact.id} className="p-4">
                                                        <Link href={`/contacts/${contact.id}`} className="flex items-center gap-2 hover:text-[#0070f2]">
                                                            <User size={16} className="text-muted-foreground" />
                                                            <div>
                                                                <div className="text-sm font-medium">{contact.name}</div>
                                                                {contact.title && (
                                                                    <div className="text-xs text-muted-foreground">{contact.title}</div>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    </div>
                                                ))}
                                                {organization.contacts.length > 2 && (
                                                    <div className="p-3 text-center">
                                                        <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setActiveTab("contacts")}>
                                                            View all contacts
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-sm text-muted-foreground">
                                                No contacts found.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="contacts" className="p-4 bg-[#f7f7f7]">
                        <Card className="border-[#e5e5e5] shadow-sm">
                            <CardHeader className="pb-2 bg-white flex justify-between items-center border-b border-[#e5e5e5]">
                                <div>
                                    <CardTitle className="text-base">Contacts</CardTitle>
                                    <CardDescription>People associated with {organization.name}</CardDescription>
                                </div>
                                <Button size="sm" className="gap-1 bg-[#0070f2] hover:bg-[#0058c4]">
                                    <PlusCircle size={14} />
                                    <span>Add Contact</span>
                                </Button>
                            </CardHeader>
                            <CardContent className="p-4">
                                {organization.contacts && organization.contacts.length > 0 ? (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {organization.contacts.map((contact: Contact) => (
                                            <Card key={contact.id} className="overflow-hidden border-[#e5e5e5] shadow-sm hover:shadow-md transition-shadow">
                                                <Link href={`/contacts/${contact.id}`} className="block p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-full bg-[#e6f2ff] text-[#0070f2]">
                                                            <User size={16} />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-[#0070f2]">{contact.name}</div>
                                                            {contact.title && (
                                                                <div className="text-xs text-muted-foreground">{contact.title}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No associated contacts found.</p>
                                        <p className="text-sm mt-1">Add a contact to get started.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="activities" className="p-4 bg-[#f7f7f7]">
                        <Card className="border-[#e5e5e5] shadow-sm">
                            <CardHeader className="pb-2 bg-white border-b border-[#e5e5e5]">
                                <CardTitle className="text-base">Activities</CardTitle>
                                <CardDescription>Recent activities and tasks</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No activities found.</p>
                                    <p className="text-sm mt-1">Activities will appear here when created.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* SAP Fiori Style Status Bar */}
            <div className="mt-auto pt-2 pb-1 px-4 text-xs text-muted-foreground flex justify-between items-center border rounded bg-[#f7f7f7]">
                <div>
                    {organization.id}
                </div>
                <div>
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Edit Dialog */}
            <EditOrganizationDialog
                organization={{
                    id: organization.id,
                    name: organization.name
                }}
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onOrganizationUpdated={handleOrganizationUpdated}
            />
        </div>
    );
} 