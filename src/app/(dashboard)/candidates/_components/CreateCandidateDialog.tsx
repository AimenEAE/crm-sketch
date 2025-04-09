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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define possible candidate statuses
const candidateStatuses = ['New', 'Screening', 'Interview', 'Offered', 'Rejected'] as const; // Use 'as const' for stricter typing

// Zod Schema for Candidate Form
const candidateSchema = z.object({
  name: z.string().min(2, { message: "Candidate name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  status: z.enum(candidateStatuses, { required_error: "Please select a status." }), // Use z.enum for predefined statuses
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

// Add props interface
interface CreateCandidateDialogProps {
  onCandidateCreated: () => void;
}

export function CreateCandidateDialog({ onCandidateCreated }: CreateCandidateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: "",
      email: "",
      status: "New", // Default status
    },
  });

  const onSubmit = async (values: CandidateFormValues) => {
    setLoading(true);
    setServerMessage("");

    // --- Placeholder for actual submission logic ---
    console.log("Submitting candidate:", values);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setServerMessage("Candidate created successfully! (Placeholder)");
      form.reset();
      onCandidateCreated(); // Call callback
      // setTimeout(() => setIsOpen(false), 2000);
    } catch (error) {
      setServerMessage("Failed to create candidate. (Placeholder)");
    }
    setLoading(false);
    // --- End Placeholder ---
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
        <Button>Add Candidate</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Candidate</DialogTitle>
          <DialogDescription>
            Enter the details for the new candidate.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Smith" {...field} disabled={loading} />
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
                    <Input type="email" placeholder="e.g., john.smith@provider.com" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Status Select */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {candidateStatuses.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
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
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Candidate"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 