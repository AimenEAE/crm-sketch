import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Placeholder fetch function
async function getContactDetails(id: string) {
    console.log("Fetching details for contact ID (placeholder):", id);
    await new Promise(resolve => setTimeout(resolve, 300));
    const contacts = [
      { id: "cont_1", firstName: "Alice", lastName: "Smith", email: "alice.s@techinnovations.com", organizationId: "org_1", organization_name: "Tech Innovations Inc.", created_at: "2024-01-16" },
      { id: "cont_2", firstName: "Bob", lastName: "Johnson", email: "bob.j@marketingsolutions.com", organizationId: "org_2", organization_name: "Marketing Solutions Ltd.", created_at: "2024-02-21" },
      { id: "cont_3", firstName: "Charlie", lastName: "Brown", email: "charlie.b@globallogistics.com", organizationId: "org_3", organization_name: "Global Logistics Co.", created_at: "2024-03-11" },
    ];
    const contact = contacts.find(c => c.id === id);
    if (!contact) return null;
    return contact;
}

interface PageProps {
    params: { contactId: string };
}

export default async function ContactDetailPage({ params }: PageProps) {
    const { contactId } = params;
    const contact = await getContactDetails(contactId);

    if (!contact) {
        return (
            <div className="py-6">
                 <Link href="/contacts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
                     <ArrowLeft size={16} /> Back to Contacts
                 </Link>
                <p>Contact not found.</p>
            </div>
        );
    }

    return (
        <div className="py-6 space-y-6">
             <Link href="/contacts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
                 <ArrowLeft size={16} /> Back to Contacts
             </Link>

            <Card>
                <CardHeader>
                    <CardTitle>{contact.firstName} {contact.lastName}</CardTitle>
                    <CardDescription>ID: {contact.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><strong>Email:</strong> {contact.email}</p>
                    <p>
                        <strong>Organization:</strong> 
                        {/* Link to organization detail page */}
                        <Link href={`/organizations/${contact.organizationId}`} className="text-blue-600 hover:underline ml-1">
                           {contact.organization_name || contact.organizationId}
                        </Link>
                    </p>
                    <p><strong>Created:</strong> {new Date(contact.created_at).toLocaleDateString()}</p>
                    {/* Add more contact details here */}
                </CardContent>
            </Card>

             {/* Placeholder for related activities/deals */}
             {/* <Card> ... </Card> */}
        </div>
    );
} 