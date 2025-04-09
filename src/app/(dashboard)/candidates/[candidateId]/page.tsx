import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Helper to map status to badge variant - Reuse or import
function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case 'new': return 'default';
    case 'screening': return 'secondary';
    case 'interview': return 'outline';
    case 'offered': return 'default';
    case 'rejected': return 'destructive';
    default: return 'secondary';
  }
}

// Placeholder fetch function
async function getCandidateDetails(id: string) {
    console.log("Fetching details for candidate ID (placeholder):", id);
    await new Promise(resolve => setTimeout(resolve, 300));
    const candidates = [
      { id: "cand_1", name: "Eva Green", email: "eva.g@example.com", status: "Screening", created_at: "2024-04-01" },
      { id: "cand_2", name: "Frank Wright", email: "frank.w@sample.net", status: "Interview", created_at: "2024-04-05" },
      { id: "cand_3", name: "Grace Hall", email: "grace.h@mail.org", status: "New", created_at: "2024-04-07" },
    ];
    const candidate = candidates.find(c => c.id === id);
    if (!candidate) return null;
    return candidate;
}

interface PageProps {
    params: { candidateId: string };
}

export default async function CandidateDetailPage({ params }: PageProps) {
    const { candidateId } = params;
    const candidate = await getCandidateDetails(candidateId);

    if (!candidate) {
        return (
            <div className="py-6">
                <Link href="/candidates" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
                    <ArrowLeft size={16} /> Back to Candidates
                </Link>
                <p>Candidate not found.</p>
            </div>
        );
    }

    return (
        <div className="py-6 space-y-6">
             <Link href="/candidates" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
                 <ArrowLeft size={16} /> Back to Candidates
             </Link>

            <Card>
                <CardHeader>
                    <CardTitle>{candidate.name}</CardTitle>
                    <CardDescription>ID: {candidate.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><strong>Email:</strong> {candidate.email}</p>
                    <p><strong>Status:</strong> <Badge variant={getStatusVariant(candidate.status)}>{candidate.status}</Badge></p>
                    <p><strong>Created:</strong> {new Date(candidate.created_at).toLocaleDateString()}</p>
                    {/* Add more candidate details here (e.g., source, notes) */}
                </CardContent>
            </Card>

            {/* Placeholder for related activities/interviews */}
             {/* <Card> ... </Card> */}
        </div>
    );
} 