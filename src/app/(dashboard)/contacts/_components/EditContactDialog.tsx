'use client'

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogClose
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Assume fetchOrganizations is defined elsewhere or imported
import { fetchOrganizations } from "./CreateContactDialog"; // Placeholder import

// Re-use or import the schema
const contactSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  organizationId: z.string({ required_error: "Please select an organization." }),
});
type ContactFormValues = z.infer<typeof contactSchema>;

interface EditContactDialogProps {
  contact: { id: string; firstName: string; lastName: string; email: string; organizationId: string }; // Simplified for example
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContactUpdated: () => void;
}

export function EditContactDialog({ contact, isOpen, onOpenChange, onContactUpdated }: EditContactDialogProps) {
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [organizations, setOrganizations] = useState<{ id: string, name: string }[]>([]);
  const [orgLoading, setOrgLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    values: {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        organizationId: contact.organizationId,
    }
  });

  useEffect(() => {
    if (contact) {
        form.reset(contact);
    }
     // Fetch organizations if dialog is open and list is empty
     if (isOpen && organizations.length === 0) {
        setOrgLoading(true);
        fetchOrganizations().then(data => {
            setOrganizations(data || []); // Ensure data is an array
        }).catch(() => {
            setServerMessage("Failed to load organizations.");
        }).finally(() => {
             setOrgLoading(false);
        });
    }
  }, [contact, isOpen, organizations.length, form]);

  const onSubmit = async (values: ContactFormValues) => {
    setLoading(true);
    setServerMessage("");
    console.log("Updating contact:", contact.id, values);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setServerMessage("Contact updated successfully! (Placeholder)");
      setLoading(false);
      onContactUpdated();
      setTimeout(() => onOpenChange(false), 1500);
    } catch (error) {
      setServerMessage("Failed to update contact. (Placeholder)");
      setLoading(false);
    }
  };

  const handleOpenChangeInternal = (open: boolean) => {
     onOpenChange(open);
     if (!open) {
         form.reset(contact); // Reset to original on close
         setServerMessage("");
         setLoading(false);
     }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>Make changes to the contact details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             {/* Form Fields (similar to CreateContactDialog) */}
             <FormField control={form.control} name="firstName" render={({ field }) => (
                 <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} disabled={loading} /></FormControl><FormMessage /></FormItem>
             )}/>
             <FormField control={form.control} name="lastName" render={({ field }) => (
                 <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} disabled={loading} /></FormControl><FormMessage /></FormItem>
             )}/>
              <FormField control={form.control} name="email" render={({ field }) => (
                 <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} disabled={loading} /></FormControl><FormMessage /></FormItem>
             )}/>
             <FormField control={form.control} name="organizationId" render={({ field }) => (
                 <FormItem>
                     <FormLabel>Organization</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value} disabled={loading || orgLoading}>
                         <FormControl><SelectTrigger><SelectValue placeholder={orgLoading ? "Loading..." : "Select organization"} /></SelectTrigger></FormControl>
                         <SelectContent>
                             {organizations.map(org => <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>)}
                         </SelectContent>
                     </Select>
                     <FormMessage />
                 </FormItem>
             )}/>

            {serverMessage && (
              <p className={`text-sm ${serverMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>{serverMessage}</p>
            )}
            <DialogFooter>
               <DialogClose asChild><Button type="button" variant="outline" disabled={loading}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={loading || orgLoading}>{loading ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 