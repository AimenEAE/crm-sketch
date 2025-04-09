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

// Re-use or import the schema
const candidateStatuses = ['New', 'Screening', 'Interview', 'Offered', 'Rejected'] as const;
const candidateSchema = z.object({
  name: z.string().min(2, { message: "Candidate name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  status: z.enum(candidateStatuses, { required_error: "Please select a status." }),
});
type CandidateFormValues = z.infer<typeof candidateSchema>;

interface EditCandidateDialogProps {
  candidate: { id: string; name: string; email: string; status: string }; // Simplified
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCandidateUpdated: () => void;
}

export function EditCandidateDialog({ candidate, isOpen, onOpenChange, onCandidateUpdated }: EditCandidateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    values: {
        name: candidate.name,
        email: candidate.email,
        status: candidate.status as typeof candidateStatuses[number], // Assert type
    }
  });

  useEffect(() => {
    if (candidate) {
        form.reset(candidate as CandidateFormValues);
    }
  }, [candidate, form]);

  const onSubmit = async (values: CandidateFormValues) => {
    setLoading(true);
    setServerMessage("");
    console.log("Updating candidate:", candidate.id, values);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setServerMessage("Candidate updated successfully! (Placeholder)");
      setLoading(false);
      onCandidateUpdated();
      setTimeout(() => onOpenChange(false), 1500);
    } catch (error) {
      setServerMessage("Failed to update candidate. (Placeholder)");
      setLoading(false);
    }
  };

   const handleOpenChangeInternal = (open: boolean) => {
     onOpenChange(open);
     if (!open) {
         form.reset(candidate as CandidateFormValues); // Reset to original on close
         setServerMessage("");
         setLoading(false);
     }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Candidate</DialogTitle>
          <DialogDescription>Make changes to the candidate details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             {/* Form Fields (similar to CreateCandidateDialog) */}
             <FormField control={form.control} name="name" render={({ field }) => (
                 <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} disabled={loading} /></FormControl><FormMessage /></FormItem>
             )}/>
             <FormField control={form.control} name="email" render={({ field }) => (
                 <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} disabled={loading} /></FormControl><FormMessage /></FormItem>
             )}/>
              <FormField control={form.control} name="status" render={({ field }) => (
                 <FormItem>
                     <FormLabel>Status</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                         <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                         <SelectContent>
                             {candidateStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 