'use client'

import { useState } from "react"; // Import useState
import { MoreHorizontal } from "lucide-react" // Icon for the trigger

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger, // We trigger manually
} from "@/components/ui/alert-dialog"

interface EntityActionsProps {
  entityId: string;
  entityType: 'organization' | 'contact' | 'candidate';
  onEdit: (id: string) => void; // Callback for edit action
  onDelete: (id: string) => void; // Callback for delete action
}

export function EntityActions({ entityId, entityType, onEdit, onDelete }: EntityActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    console.log(`Edit ${entityType} with ID:`, entityId);
    onEdit(entityId);
    // Later: Open edit dialog/modal
  }

  // Trigger opening the confirmation dialog
  const promptDelete = () => {
    setIsDeleteDialogOpen(true);
  }

  // Actual delete logic, called from confirmation dialog
  const confirmDelete = () => {
    console.log(`Confirmed delete ${entityType} with ID:`, entityId);
    onDelete(entityId);
    setIsDeleteDialogOpen(false); // Close dialog after action
    console.log(`${entityType} ${entityId} deleted (placeholder).`);
    // Add actual delete logic and potentially refresh data
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleEdit}>
            Edit {entityType}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Trigger the alert dialog instead of direct delete */}
          <DropdownMenuItem onClick={promptDelete} className="text-red-600 focus:text-red-700 focus:bg-red-50">
            Delete {entityType}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {entityType} 
              and any associated data (placeholder - check relations!).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 