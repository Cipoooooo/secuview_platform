"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Clock, User, Activity } from "lucide-react"
import type { FirewallRule } from "@/types"

interface FirewallRuleDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule: FirewallRule
  onRuleUpdated: (rule: FirewallRule) => void
}

export function FirewallRuleDetailsDialog({ open, onOpenChange, rule, onRuleUpdated }: FirewallRuleDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(rule)
  const [tags, setTags] = useState<string[]>(rule.tags || [])
  const [tagInput, setTagInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedRule: FirewallRule = {
      ...formData,
      tags,
      modifiedAt: new Date(),
      version: rule.version + 1,
    }

    onRuleUpdated(updatedRule)
    setIsEditing(false)
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Firewall Rule Details</span>
            <Badge variant={rule.action === "allow" ? "default" : rule.action === "deny" ? "destructive" : "secondary"}>
              {rule.action.toUpperCase()}
            </Badge>
          </DialogTitle>
          <DialogDescription>View and edit firewall rule configuration and settings</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Rule Details</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Rule Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="action">Action *</Label>
                    <Select
                      value={formData.action}
                      onValueChange={(value: "allow" | "deny" | "log") => setFormData({ ...formData, action: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allow">Allow</SelectItem>
                        <SelectItem value="deny">Deny</SelectItem>
                        <SelectItem value="log">Log Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="source">Source *</Label>
                    <Input
                      id="source"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="port">Port *</Label>
                    <Input
                      id="port"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="protocol">Protocol *</Label>
                    <Select
                      value={formData.protocol}
                      onValueChange={(value: "tcp" | "udp" | "icmp" | "any") =>
                        setFormData({ ...formData, protocol: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP</SelectItem>
                        <SelectItem value="udp">UDP</SelectItem>
                        <SelectItem value="icmp">ICMP</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: Number.parseInt(e.target.value) || 100 })}
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={formData.enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                  />
                  <Label htmlFor="enabled">Rule enabled</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Save Changes</Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <CardDescription>{rule.description || "No description provided"}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Status:</span>
                          <Badge variant={rule.enabled ? "default" : "secondary"}>
                            {rule.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Priority:</span>
                          <span className="text-sm">{rule.priority}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Version:</span>
                          <span className="text-sm">v{rule.version}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Network Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Source:</span>
                          <span className="text-sm font-mono">{rule.source}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Destination:</span>
                          <span className="text-sm font-mono">{rule.destination}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Port:</span>
                          <span className="text-sm font-mono">{rule.port}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Protocol:</span>
                          <span className="text-sm uppercase">{rule.protocol}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {rule.tags && rule.tags.length > 0 && (
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {rule.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(true)}>Edit Rule</Button>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rule Hits</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">+12% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blocked Traffic</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4 GB</div>
                  <p className="text-xs text-muted-foreground">Traffic blocked today</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Performance</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0.2ms</div>
                  <p className="text-xs text-muted-foreground">Average processing time</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rule History</CardTitle>
                <CardDescription>Track changes and modifications to this firewall rule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Rule created</p>
                        <span className="text-xs text-muted-foreground">{rule.createdAt.toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Initial rule configuration established</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b">
                    <div className="rounded-full bg-blue-100 p-2">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Rule modified</p>
                        <span className="text-xs text-muted-foreground">{rule.modifiedAt.toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Priority updated from 50 to {rule.priority}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
