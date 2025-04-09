'use client'

import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define Zod schema for validation
const organizationSchema = z.object({
  name: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

// Define props interface
interface CreateOrganizationDialogProps {
  onOrganizationCreated: () => void; // Callback to refresh data
  children?: React.ReactNode; // Optional children for custom trigger
}

export function CreateOrganizationDialog({ onOrganizationCreated, children }: CreateOrganizationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState(""); // For success/error messages post-submit

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: OrganizationFormValues) => {
    setLoading(true);
    setServerMessage("");

    // --- Placeholder for actual submission logic ---
    console.log("Submitting organization:", values);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setServerMessage("Organization created successfully! (Placeholder)");
      form.reset();
      setLoading(false);
      onOrganizationCreated(); // Call the callback on success
      // setTimeout(() => setIsOpen(false), 2000);
    } catch (error) {
      setServerMessage("Failed to create organization. (Placeholder)");
      setLoading(false);
    }
    // --- End Placeholder ---
  };

  // Reset form state when dialog is opened or closed
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset(); // Reset form state and errors
      setServerMessage("");
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || <Button>Add Organization</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Enter the name for the new organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Organization Name</FormLabel>
                   <FormControl>
                     <Input placeholder="e.g., Acme Corp" {...field} disabled={loading} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />

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
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Organization"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 