"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, User, Tag, Server, MessageSquare, FileText, AlertTriangle, CheckCircle, Play, Pause } from "lucide-react"
import { mockUsers } from "@/lib/mock-data"
import type { SecurityIncident } from "@/types"

interface IncidentDetailsDialogProps {
  incident: SecurityIncident
  onClose: () => void
  onUpdate: (incident: SecurityIncident) => void
}

export function IncidentDetailsDialog({ incident, onClose, onUpdate }: IncidentDetailsDialogProps) {
  const [editingIncident, setEditingIncident] = useState(incident)
  const [newComment, setNewComment] = useState("")

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

  const handleStatusChange = (newStatus: SecurityIncident["status"]) => {
    const updatedIncident = {
      ...editingIncident,
      status: newStatus,
      resolvedAt: newStatus === "resolved" || newStatus === "closed" ? new Date() : undefined,
    }
    setEditingIncident(updatedIncident)
    onUpdate(updatedIncident)
  }

  const handleAssigneeChange = (newAssignee: string) => {
    const updatedIncident = {
      ...editingIncident,
      assignedTo: newAssignee === "unassigned" ? undefined : newAssignee,
    }
    setEditingIncident(updatedIncident)
    onUpdate(updatedIncident)
  }

  const handleSeverityChange = (newSeverity: SecurityIncident["severity"]) => {
    const updatedIncident = {
      ...editingIncident,
      severity: newSeverity,
    }
    setEditingIncident(updatedIncident)
    onUpdate(updatedIncident)
  }

  const mockTimeline = [
    {
      id: "1",
      timestamp: editingIncident.detectedAt,
      userId: "system",
      action: "Incident Created",
      description: "Incident automatically detected and created",
      type: "status_change" as const,
    },
    {
      id: "2",
      timestamp: new Date(editingIncident.detectedAt.getTime() + 300000),
      userId: editingIncident.assignedTo || "1",
      action: "Assigned",
      description: `Incident assigned to ${getUserName(editingIncident.assignedTo || "1")}`,
      type: "assignment" as const,
    },
    {
      id: "3",
      timestamp: new Date(editingIncident.detectedAt.getTime() + 600000),
      userId: editingIncident.assignedTo || "1",
      action: "Status Updated",
      description: `Status changed to ${editingIncident.status}`,
      type: "status_change" as const,
    },
  ]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl">{editingIncident.title}</DialogTitle>
              <DialogDescription>
                Incident ID: {editingIncident.id} • Detected: {editingIncident.detectedAt.toLocaleString()}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Assignment Controls */}
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={editingIncident.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select value={editingIncident.severity} onValueChange={handleSeverityChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assignee</label>
              <Select value={editingIncident.assignedTo || "unassigned"} onValueChange={handleAssigneeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {mockUsers
                    .filter((u) => u.role === "admin" || u.role === "analyst")
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Incident Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Severity</label>
                      <div className="mt-1">
                        <Badge variant={getSeverityBadgeVariant(editingIncident.severity)}>
                          {editingIncident.severity}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="mt-1">
                        <Badge variant={getStatusBadgeVariant(editingIncident.status)}>{editingIncident.status}</Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Detected At</label>
                      <div className="mt-1 text-sm">{editingIncident.detectedAt.toLocaleString()}</div>
                    </div>
                    {editingIncident.resolvedAt && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Resolved At</label>
                        <div className="mt-1 text-sm">{editingIncident.resolvedAt.toLocaleString()}</div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <div className="mt-1 text-sm">{editingIncident.description}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tags</label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {editingIncident.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="mr-1 h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Affected Assets</label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {editingIncident.affectedAssets.map((asset) => (
                        <Badge key={asset} variant="outline" className="text-xs">
                          <Server className="mr-1 h-3 w-3" />
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Incident Timeline</CardTitle>
                  <CardDescription>Chronological history of incident activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTimeline.map((entry, index) => (
                      <div key={entry.id} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              entry.type === "status_change"
                                ? "bg-blue-100 text-blue-600"
                                : entry.type === "assignment"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {entry.type === "status_change" ? (
                              <AlertTriangle className="h-4 w-4" />
                            ) : entry.type === "assignment" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <MessageSquare className="h-4 w-4" />
                            )}
                          </div>
                          {index < mockTimeline.length - 1 && <div className="w-px h-8 bg-border mt-2" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{entry.action}</span>
                            <span className="text-xs text-muted-foreground">{entry.timestamp.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{entry.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evidence" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evidence & Attachments</CardTitle>
                  <CardDescription>Files, logs, and evidence related to this incident</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Evidence Uploaded</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload screenshots, logs, or other evidence to support the investigation.
                    </p>
                    <Button variant="outline">Upload Evidence</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response Actions</CardTitle>
                  <CardDescription>Actions taken to investigate and resolve this incident</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Add Comment</label>
                    <Textarea
                      placeholder="Document investigation steps, findings, or actions taken..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button size="sm">Add Comment</Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quick Actions</label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Play className="mr-2 h-4 w-4" />
                        Start Investigation
                      </Button>
                      <Button variant="outline" size="sm">
                        <Pause className="mr-2 h-4 w-4" />
                        Escalate Incident
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Resolved
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
