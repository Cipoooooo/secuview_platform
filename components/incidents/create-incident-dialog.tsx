"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { mockUsers } from "@/lib/mock-data"
import type { SecurityIncident } from "@/types"

interface CreateIncidentDialogProps {
  onSubmit: (incident: Partial<SecurityIncident>) => void
}

export function CreateIncidentDialog({ onSubmit }: CreateIncidentDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    severity: "medium" as SecurityIncident["severity"],
    description: "",
    assignedTo: "",
    tags: [] as string[],
    affectedAssets: [] as string[],
  })
  const [newTag, setNewTag] = useState("")
  const [newAsset, setNewAsset] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: "",
      severity: "medium",
      description: "",
      assignedTo: "",
      tags: [],
      affectedAssets: [],
    })
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const addAsset = () => {
    if (newAsset.trim() && !formData.affectedAssets.includes(newAsset.trim())) {
      setFormData({
        ...formData,
        affectedAssets: [...formData.affectedAssets, newAsset.trim()],
      })
      setNewAsset("")
    }
  }

  const removeAsset = (assetToRemove: string) => {
    setFormData({
      ...formData,
      affectedAssets: formData.affectedAssets.filter((asset) => asset !== assetToRemove),
    })
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Create New Incident</DialogTitle>
        <DialogDescription>Report a new security incident for investigation and tracking.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="col-span-3"
              placeholder="Brief description of the incident"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="severity" className="text-right">
              Severity
            </Label>
            <Select
              value={formData.severity}
              onValueChange={(value: SecurityIncident["severity"]) => setFormData({ ...formData, severity: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignee" className="text-right">
              Assignee
            </Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select assignee (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {mockUsers
                  .filter((u) => u.role === "admin" || u.role === "analyst")
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="col-span-3"
              placeholder="Detailed description of the incident, including what was observed, when it occurred, and any initial analysis..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">Tags</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag (e.g., malware, phishing)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">Affected Assets</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newAsset}
                  onChange={(e) => setNewAsset(e.target.value)}
                  placeholder="Add affected asset (e.g., web-server-01)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAsset())}
                />
                <Button type="button" variant="outline" onClick={addAsset}>
                  Add
                </Button>
              </div>
              {formData.affectedAssets.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {formData.affectedAssets.map((asset) => (
                    <Badge key={asset} variant="outline" className="text-xs">
                      {asset}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeAsset(asset)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Incident</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
