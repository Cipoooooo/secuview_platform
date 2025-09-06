"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, AlertTriangle, Clock, User, FileText, TrendingUp, TrendingDown } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { IncidentDetailsDialog } from "@/components/incidents/incident-details-dialog"
import { CreateIncidentDialog } from "@/components/incidents/create-incident-dialog"
import { mockIncidents, mockUsers } from "@/lib/mock-data"
import type { SecurityIncident } from "@/types"

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<SecurityIncident[]>(mockIncidents)
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter
    const matchesAssignee = assigneeFilter === "all" || incident.assignedTo === assigneeFilter
    return matchesSearch && matchesSeverity && matchesStatus && matchesAssignee
  })

  const getSeverityBadgeVariant = (severity: SecurityIncident["severity"]) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusBadgeVariant = (status: SecurityIncident["status"]) => {
    switch (status) {
      case "open":
        return "destructive"
      case "investigating":
        return "default"
      case "resolved":
        return "secondary"
      case "closed":
        return "outline"
      default:
        return "outline"
    }
  }

  const getUserName = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    return user?.name || "Unassigned"
  }

  const incidentStats = {
    total: incidents.length,
    open: incidents.filter((i) => i.status === "open").length,
    investigating: incidents.filter((i) => i.status === "investigating").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
    closed: incidents.filter((i) => i.status === "closed").length,
    critical: incidents.filter((i) => i.severity === "critical").length,
    high: incidents.filter((i) => i.severity === "high").length,
  }

  const handleCreateIncident = (incidentData: Partial<SecurityIncident>) => {
    const newIncident: SecurityIncident = {
      id: `inc-${Date.now()}`,
      title: incidentData.title || "",
      severity: incidentData.severity || "medium",
      status: "open",
      description: incidentData.description || "",
      detectedAt: new Date(),
      assignedTo: incidentData.assignedTo,
      tags: incidentData.tags || [],
      affectedAssets: incidentData.affectedAssets || [],
    }
    setIncidents([newIncident, ...incidents])
    setIsCreateDialogOpen(false)
  }

  const handleUpdateIncident = (updatedIncident: SecurityIncident) => {
    setIncidents(incidents.map((inc) => (inc.id === updatedIncident.id ? updatedIncident : inc)))
    setSelectedIncident(updatedIncident)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Incident Management</h1>
            <p className="text-muted-foreground">Monitor, investigate, and resolve security incidents</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Incident
              </Button>
            </DialogTrigger>
            <CreateIncidentDialog onSubmit={handleCreateIncident} />
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{incidentStats.total}</div>
              <p className="text-xs text-muted-foreground">{incidentStats.open + incidentStats.investigating} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical & High</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{incidentStats.critical + incidentStats.high}</div>
              <p className="text-xs text-muted-foreground">
                {incidentStats.critical} critical, {incidentStats.high} high
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{incidentStats.investigating}</div>
              <p className="text-xs text-muted-foreground">Being actively investigated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(((incidentStats.resolved + incidentStats.closed) / incidentStats.total) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {incidentStats.resolved + incidentStats.closed} resolved/closed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Incident List</TabsTrigger>
            <TabsTrigger value="board">Kanban Board</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Security Incidents</CardTitle>
                <CardDescription>All security incidents and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search incidents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assignees</SelectItem>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Incidents Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Incident</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Detected</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents.map((incident) => (
                      <TableRow key={incident.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{incident.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">{incident.description}</div>
                            <div className="flex items-center gap-1">
                              {incident.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {incident.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{incident.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getSeverityBadgeVariant(incident.severity)}>{incident.severity}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(incident.status)}>{incident.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {getUserName(incident.assignedTo || "")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {incident.detectedAt.toLocaleDateString()}
                            <div className="text-xs text-muted-foreground">
                              {incident.detectedAt.toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => setSelectedIncident(incident)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="board">
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Kanban Board Coming Soon</h3>
              <p className="text-muted-foreground">
                Visual incident management board will be available in the next update.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Analytics Dashboard Coming Soon</h3>
              <p className="text-muted-foreground">
                Detailed incident analytics and reporting will be available in the next update.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Incident Details Dialog */}
        {selectedIncident && (
          <IncidentDetailsDialog
            incident={selectedIncident}
            onClose={() => setSelectedIncident(null)}
            onUpdate={handleUpdateIncident}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
