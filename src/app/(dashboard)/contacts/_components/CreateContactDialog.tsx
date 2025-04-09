'use client'

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" // Keep Label for general layout if needed, but FormLabel is preferred within FormField
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Export fetchOrganizations if it's defined here
export async function fetchOrganizations() {
  console.log("Fetching organizations (placeholder)");
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: "org_1", name: "Tech Innovations Inc." },
    { id: "org_2", name: "Marketing Solutions Ltd." },
    { id: "org_3", name: "Global Logistics Co." },
  ];
}

// Zod Schema for Contact Form
const contactSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  organizationId: z.string({ required_error: "Please select an organization." }), // Ensure a string value is selected
});

type ContactFormValues = z.infer<typeof contactSchema>;

// Define props including the callback
interface CreateContactDialogProps {
  onContactCreated: () => void;
  children?: React.ReactNode;
}

export function CreateContactDialog({ onContactCreated, children }: CreateContactDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [organizations, setOrganizations] = useState<{ id: string, name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [orgLoading, setOrgLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      organizationId: undefined,
    },
  });

  // Fetch organizations when the dialog is about to open
  useEffect(() => {
    if (isOpen && organizations.length === 0) {
      setOrgLoading(true);
      fetchOrganizations().then(data => {
        setOrganizations(data);
        setOrgLoading(false);
      }).catch(() => {
        setServerMessage("Failed to load organizations.") // Handle fetch error
        setOrgLoading(false);
      })
    }
  }, [isOpen, organizations.length]);

  const onSubmit = async (values: ContactFormValues) => {
    setLoading(true);
    setServerMessage("");
    try {
      // --- Placeholder submission ---
      console.log("Submitting contact:", values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setServerMessage("Contact created successfully! (Placeholder)");
      form.reset();
      onContactCreated(); // Call the callback
      // setTimeout(() => setIsOpen(false), 1500);
      // --- End Placeholder ---
    } catch (error) {
      setServerMessage("Failed to create contact. (Placeholder)");
    }
    setLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
      setServerMessage("");
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || <Button>Add Contact</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Contact</DialogTitle>
          <DialogDescription>
            Enter the details for the new contact.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Doe" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., jane.doe@example.com" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Organization Select */}
             <FormField
               control={form.control}
               name="organizationId"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Organization</FormLabel>
                   <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading || orgLoading}
                    >
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder={orgLoading ? "Loading orgs..." : "Select organization"} />
                       </SelectTrigger>
                      </FormControl>
                     <SelectContent>
                       {organizations.map(org => (
                         <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                    <FormMessage />
                 </FormItem>
               )}
             />

            {/* Server Message Area */}
            {serverMessage && (
              <p className={`text-sm ${serverMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                {serverMessage}
              </p>
            )}

            <DialogFooter>
               <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={loading}>
                    Cancel
                  </Button>
               </DialogClose>
              <Button type="submit" disabled={loading || orgLoading}>
                {loading ? "Creating..." : "Create Contact"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 