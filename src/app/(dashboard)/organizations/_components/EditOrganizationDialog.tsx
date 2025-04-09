'use client'

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Re-use or import the schema
const organizationSchema = z.object({
  name: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
});
type OrganizationFormValues = z.infer<typeof organizationSchema>;

interface EditOrganizationDialogProps {
  organization: { id: string; name: string }; // Data of the org being edited
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOrganizationUpdated: () => void; // Callback to refresh data list
}

export function EditOrganizationDialog({ organization, isOpen, onOpenChange, onOrganizationUpdated }: EditOrganizationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    // Pre-fill form with existing data when the dialog opens
    values: {
        name: organization.name
    }
  });

  // Reset form when the organization prop changes (e.g., opening dialog for a different org)
  useEffect(() => {
    if (organization) {
        form.reset({ name: organization.name });
    }
  }, [organization, form]);

  const onSubmit = async (values: OrganizationFormValues) => {
    setLoading(true);
    setServerMessage("");
    console.log("Updating organization:", organization.id, values);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setServerMessage("Organization updated successfully! (Placeholder)");
      setLoading(false);
      onOrganizationUpdated(); // Trigger data refresh in parent
      setTimeout(() => onOpenChange(false), 1500); // Close dialog after delay
    } catch (error) {
      setServerMessage("Failed to update organization. (Placeholder)");
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
     onOpenChange(open);
     if (!open) {
         form.reset({ name: organization.name }); // Reset to original values on close
         setServerMessage("");
         setLoading(false);
     }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>
            Make changes to the organization name.
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
                     <Input {...field} disabled={loading} />
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
                 <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
               </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 