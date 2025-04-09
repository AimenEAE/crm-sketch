'use client'

import { useState, useEffect } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Search, Filter, Download, Settings } from 'lucide-react'

// Types definition
interface SalesOpportunity {
  id: string;
  name: string;
  organizationName: string;
  organizationId: string;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  value: number;
  probability: number;
  expectedCloseDate: string;
  owner: string;
  created_at: string;
}

// Stage definitions and colors
const pipelineStages = [
  { id: 'lead', name: 'Lead', color: '#0070f2' },
  { id: 'qualified', name: 'Qualified', color: '#00a3bf' },
  { id: 'proposal', name: 'Proposal', color: '#00bfa0' },
  { id: 'negotiation', name: 'Negotiation', color: '#ffc400' },
  { id: 'closed_won', name: 'Closed Won', color: '#36b37e' },
  { id: 'closed_lost', name: 'Closed Lost', color: '#ff5630' },
];

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value);
};

// Placeholder data
const initialOpportunities: SalesOpportunity[] = [
  {
    id: 'opp_1',
    name: 'Enterprise ERP Implementation',
    organizationName: 'Tech Innovations Inc.',
    organizationId: 'org_1',
    stage: 'proposal',
    value: 150000,
    probability: 60,
    expectedCloseDate: '2024-06-30',
    owner: 'John Smith',
    created_at: '2024-03-15'
  },
  {
    id: 'opp_2',
    name: 'Cloud Migration Project',
    organizationName: 'Global Logistics Co.',
    organizationId: 'org_3',
    stage: 'qualified',
    value: 75000,
    probability: 40,
    expectedCloseDate: '2024-07-15',
    owner: 'Sarah Johnson',
    created_at: '2024-04-01'
  },
  {
    id: 'opp_3',
    name: 'CRM Software License',
    organizationName: 'Marketing Solutions Ltd.',
    organizationId: 'org_2',
    stage: 'negotiation',
    value: 45000,
    probability: 80,
    expectedCloseDate: '2024-05-10',
    owner: 'Michael Chen',
    created_at: '2024-02-20'
  },
  {
    id: 'opp_4',
    name: 'Cybersecurity Assessment',
    organizationName: 'Tech Innovations Inc.',
    organizationId: 'org_1',
    stage: 'lead',
    value: 25000,
    probability: 20,
    expectedCloseDate: '2024-08-01',
    owner: 'John Smith',
    created_at: '2024-04-05'
  },
  {
    id: 'opp_5',
    name: 'Digital Marketing Campaign',
    organizationName: 'Marketing Solutions Ltd.',
    organizationId: 'org_2',
    stage: 'closed_won',
    value: 35000,
    probability: 100,
    expectedCloseDate: '2024-03-31',
    owner: 'Sarah Johnson',
    created_at: '2024-01-15'
  },
  {
    id: 'opp_6',
    name: 'Software Development Project',
    organizationName: 'Global Logistics Co.',
    organizationId: 'org_3',
    stage: 'closed_lost',
    value: 120000,
    probability: 0,
    expectedCloseDate: '2024-03-01',
    owner: 'Michael Chen',
    created_at: '2023-12-10'
  },
];

// Helper function to get stage badge variant
function getStageBadgeVariant(stage: string): "default" | "secondary" | "outline" | "destructive" {
  switch(stage) {
    case 'lead': return 'default';
    case 'qualified': return 'secondary';
    case 'proposal': return 'secondary';
    case 'negotiation': return 'outline';
    case 'closed_won': return 'default';
    case 'closed_lost': return 'destructive';
    default: return 'default';
  }
}

export default function SalesPipelinePage() {
  const [opportunities, setOpportunities] = useState<SalesOpportunity[]>(initialOpportunities);
  const [filteredOpportunities, setFilteredOpportunities] = useState<SalesOpportunity[]>(initialOpportunities);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof SalesOpportunity>('expectedCloseDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Calculate pipeline metrics
  const pipelineMetrics = {
    totalValue: opportunities.reduce((sum, opp) => sum + opp.value, 0),
    weightedValue: opportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0),
    leadCount: opportunities.filter(opp => opp.stage === 'lead').length,
    qualifiedCount: opportunities.filter(opp => opp.stage === 'qualified').length,
    proposalCount: opportunities.filter(opp => opp.stage === 'proposal').length,
    negotiationCount: opportunities.filter(opp => opp.stage === 'negotiation').length,
    closedWonCount: opportunities.filter(opp => opp.stage === 'closed_won').length,
    closedLostCount: opportunities.filter(opp => opp.stage === 'closed_lost').length,
    avgDealValue: opportunities.length > 0 ? opportunities.reduce((sum, opp) => sum + opp.value, 0) / opportunities.length : 0
  };

  // Calculate counts per stage for visualization
  const stageCounts = pipelineStages.map(stage => ({
    ...stage,
    count: opportunities.filter(opp => opp.stage === stage.id).length,
    value: opportunities.filter(opp => opp.stage === stage.id).reduce((sum, opp) => sum + opp.value, 0)
  }));

  // Sort and filter opportunities
  useEffect(() => {
    let result = [...opportunities];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(opp => 
        opp.name.toLowerCase().includes(term) || 
        opp.organizationName.toLowerCase().includes(term) ||
        opp.owner.toLowerCase().includes(term)
      );
    }
    
    // Apply stage filter
    if (stageFilter !== 'all') {
      result = result.filter(opp => opp.stage === stageFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });
    
    setFilteredOpportunities(result);
  }, [opportunities, searchTerm, stageFilter, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field: keyof SalesOpportunity) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* SAP Fiori Style Header */}
      <div className="bg-white border-b mb-4 pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-[#0070f2]">Sales Pipeline</h2>
          <p className="text-sm text-muted-foreground">Track and manage your sales opportunities</p>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <Card className="border-l-4 border-l-[#0070f2]">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Pipeline Value</div>
              <div className="text-2xl font-semibold">{formatCurrency(pipelineMetrics.totalValue)}</div>
              <div className="text-sm text-muted-foreground">Weighted: {formatCurrency(pipelineMetrics.weightedValue)}</div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Average Deal Size</div>
              <div className="text-2xl font-semibold">{formatCurrency(pipelineMetrics.avgDealValue)}</div>
              <div className="text-sm text-muted-foreground">Total Deals: {opportunities.length}</div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Win Rate</div>
              <div className="text-2xl font-semibold">
                {pipelineMetrics.closedWonCount + pipelineMetrics.closedLostCount > 0 
                  ? `${Math.round((pipelineMetrics.closedWonCount / (pipelineMetrics.closedWonCount + pipelineMetrics.closedLostCount)) * 100)}%` 
                  : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Won: {pipelineMetrics.closedWonCount}, Lost: {pipelineMetrics.closedLostCount}</div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Pipeline Visualization */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Pipeline Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-1 h-[100px]">
            {stageCounts.map((stage, index) => (
              <div 
                key={stage.id} 
                className="flex flex-col relative h-full cursor-pointer transition-all hover:opacity-90"
                onClick={() => setStageFilter(stage.id === stageFilter ? 'all' : stage.id)}
                style={{ 
                  opacity: stageFilter === 'all' || stageFilter === stage.id ? 1 : 0.5
                }}
              >
                <div 
                  className="flex-1 rounded-t-md flex items-center justify-center text-white text-xs font-medium"
                  style={{ 
                    backgroundColor: stage.color,
                    height: `${Math.max(10, Math.min(100, (stage.count / Math.max(...stageCounts.map(s => s.count))) * 100))}%`
                  }}
                >
                  {stage.count}
                </div>
                <div className="p-1 text-[10px] text-center bg-[#f5f5f5] border-x border-b rounded-b-md">
                  <div className="font-medium truncate" title={stage.name}>{stage.name}</div>
                  <div className="text-muted-foreground">{formatCurrency(stage.value)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-md border">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search opportunities..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="h-10 gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button size="sm" className="h-10 gap-1 bg-[#0070f2] hover:bg-[#0058c4]">
            <span>+ New Opportunity</span>
          </Button>
        </div>
      </div>
      
      {/* Stage Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={stageFilter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setStageFilter('all')}
        >
          All
          <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">{opportunities.length}</Badge>
        </Button>
        {pipelineStages.map(stage => (
          <Button 
            key={stage.id}
            variant={stageFilter === stage.id ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStageFilter(stage.id)}
            style={{ borderColor: stageFilter === stage.id ? stage.color : undefined }}
          >
            {stage.name}
            <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">
              {opportunities.filter(o => o.stage === stage.id).length}
            </Badge>
          </Button>
        ))}
      </div>
      
      {/* Opportunities Table */}
      <Card className="overflow-hidden shadow-sm border-[#e5e5e5]">
        <div className="bg-[#f0f0f0] border-b border-[#e5e5e5] px-4 py-2 flex justify-between items-center">
          <div className="text-sm font-semibold text-[#333333]">
            Opportunities ({filteredOpportunities.length})
          </div>
          <Button variant="ghost" size="sm" className="h-7 gap-1">
            <Settings className="h-3 w-3" />
            <span className="text-xs">Customize</span>
          </Button>
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <div className="px-4 py-2 bg-[#f7f7f7] border-b border-[#e5e5e5]">
            <TabsList className="bg-transparent h-8 p-0 space-x-2">
              <TabsTrigger value="active" className="rounded-md data-[state=active]:bg-white px-3 py-1 h-8">
                Active
              </TabsTrigger>
              <TabsTrigger value="won" className="rounded-md data-[state=active]:bg-white px-3 py-1 h-8">
                Won
              </TabsTrigger>
              <TabsTrigger value="lost" className="rounded-md data-[state=active]:bg-white px-3 py-1 h-8">
                Lost
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="active" className="mt-0 pt-0">
            <Table>
              <TableHeader className="bg-[#f7f7f7]">
                <TableRow>
                  <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      Opportunity Name
                      {sortField === 'name' && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort('organizationName')}>
                    <div className="flex items-center gap-1">
                      Organization
                      {sortField === 'organizationName' && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort('stage')}>
                    <div className="flex items-center gap-1">
                      Stage
                      {sortField === 'stage' && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold cursor-pointer text-right" onClick={() => handleSort('value')}>
                    <div className="flex items-center gap-1 justify-end">
                      Value
                      {sortField === 'value' && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort('probability')}>
                    <div className="flex items-center gap-1">
                      Probability
                      {sortField === 'probability' && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort('expectedCloseDate')}>
                    <div className="flex items-center gap-1">
                      Expected Close
                      {sortField === 'expectedCloseDate' && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold cursor-pointer" onClick={() => handleSort('owner')}>
                    <div className="flex items-center gap-1">
                      Owner
                      {sortField === 'owner' && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities
                  .filter(opp => opp.stage !== 'closed_won' && opp.stage !== 'closed_lost')
                  .map((opportunity) => (
                  <TableRow key={opportunity.id} className="hover:bg-[#f8f9fb] border-b border-[#e5e5e5]">
                    <TableCell className="font-medium text-[#0070f2]">
                      <a href={`/opportunities/${opportunity.id}`} className="hover:underline">
                        {opportunity.name}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a href={`/organizations/${opportunity.organizationId}`} className="hover:underline text-[#0070f2]">
                        {opportunity.organizationName}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStageBadgeVariant(opportunity.stage)}>
                        {pipelineStages.find(stage => stage.id === opportunity.stage)?.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(opportunity.value)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${opportunity.probability}%`,
                              backgroundColor: opportunity.probability > 70 ? '#36b37e' : 
                                              opportunity.probability > 30 ? '#ffc400' : '#ff5630'
                            }}
                          ></div>
                        </div>
                        <span className="text-xs">{opportunity.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{opportunity.owner}</TableCell>
                  </TableRow>
                ))}
                {filteredOpportunities.filter(opp => opp.stage !== 'closed_won' && opp.stage !== 'closed_lost').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No active opportunities found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="won" className="mt-0 pt-0">
            <Table>
              <TableHeader className="bg-[#f7f7f7]">
                <TableRow>
                  <TableHead className="font-semibold">Opportunity Name</TableHead>
                  <TableHead className="font-semibold">Organization</TableHead>
                  <TableHead className="font-semibold">Value</TableHead>
                  <TableHead className="font-semibold">Close Date</TableHead>
                  <TableHead className="font-semibold">Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities
                  .filter(opp => opp.stage === 'closed_won')
                  .map((opportunity) => (
                  <TableRow key={opportunity.id} className="hover:bg-[#f8f9fb] border-b border-[#e5e5e5]">
                    <TableCell className="font-medium text-[#0070f2]">
                      <a href={`/opportunities/${opportunity.id}`} className="hover:underline">
                        {opportunity.name}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a href={`/organizations/${opportunity.organizationId}`} className="hover:underline text-[#0070f2]">
                        {opportunity.organizationName}
                      </a>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(opportunity.value)}
                    </TableCell>
                    <TableCell>
                      {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{opportunity.owner}</TableCell>
                  </TableRow>
                ))}
                {filteredOpportunities.filter(opp => opp.stage === 'closed_won').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No won opportunities found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="lost" className="mt-0 pt-0">
            <Table>
              <TableHeader className="bg-[#f7f7f7]">
                <TableRow>
                  <TableHead className="font-semibold">Opportunity Name</TableHead>
                  <TableHead className="font-semibold">Organization</TableHead>
                  <TableHead className="font-semibold">Value</TableHead>
                  <TableHead className="font-semibold">Close Date</TableHead>
                  <TableHead className="font-semibold">Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities
                  .filter(opp => opp.stage === 'closed_lost')
                  .map((opportunity) => (
                  <TableRow key={opportunity.id} className="hover:bg-[#f8f9fb] border-b border-[#e5e5e5]">
                    <TableCell className="font-medium text-[#0070f2]">
                      <a href={`/opportunities/${opportunity.id}`} className="hover:underline">
                        {opportunity.name}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a href={`/organizations/${opportunity.organizationId}`} className="hover:underline text-[#0070f2]">
                        {opportunity.organizationName}
                      </a>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(opportunity.value)}
                    </TableCell>
                    <TableCell>
                      {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{opportunity.owner}</TableCell>
                  </TableRow>
                ))}
                {filteredOpportunities.filter(opp => opp.stage === 'closed_lost').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No lost opportunities found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Status Footer */}
      <div className="mt-4 py-2 px-4 text-xs text-muted-foreground flex justify-between items-center border rounded bg-[#f7f7f7]">
        <div>
          Showing {filteredOpportunities.length} of {opportunities.length} opportunities
        </div>
        <div>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
} 