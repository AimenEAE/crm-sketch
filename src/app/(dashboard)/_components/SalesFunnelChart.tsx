'use client';

import React from 'react';
import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define a type for the processed funnel data
interface FunnelDataPoint {
  name: string; // Status name
  value: number; // Count of candidates
  fill: string; // Color for this stage
}

interface SalesFunnelChartProps {
  data: FunnelDataPoint[];
}

// Define colors for the funnel stages (adjust as needed)
const COLORS = [
  '#0088FE', // New
  '#00C49F', // Screening
  '#FFBB28', // Interview
  '#FF8042', // Offered
  '#FF4842', // Rejected (Optional, sometimes rejected isn't shown in the main funnel)
];

export function SalesFunnelChart({ data }: SalesFunnelChartProps) {
  if (!data || data.length === 0) {
    return (
       <Card>
         <CardHeader>
           <CardTitle>Candidate Funnel</CardTitle>
         </CardHeader>
         <CardContent>
           <p className="text-muted-foreground">No candidate data available to display funnel.</p>
         </CardContent>
       </Card>
    );
  }

  return (
    <Card>
       <CardHeader>
         <CardTitle>Candidate Funnel</CardTitle>
       </CardHeader>
       <CardContent>
         {/* Ensure parent container has a defined height for ResponsiveContainer */}
         <div style={{ width: '100%', height: 300 }}>
           <ResponsiveContainer>
             <FunnelChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
               <Tooltip />
               <Funnel
                 dataKey="value"
                 data={data}
                 isAnimationActive
               >
                 {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                 ))}
                 <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                 <LabelList position="center" fill="#fff" stroke="none" dataKey="value" formatter={(value: number) => value.toString()} />
               </Funnel>
             </FunnelChart>
           </ResponsiveContainer>
         </div>
       </CardContent>
     </Card>
  );
} 