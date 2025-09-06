"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { FirewallRule } from "@/types"

interface CreateFirewallRuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRuleCreated: (rule: FirewallRule) => void
}

export function CreateFirewallRuleDialog({ open, onOpenChange, onRuleCreated }: CreateFirewallRuleDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    action: "allow" as "allow" | "deny" | "log",
    source: "",
    destination: "",
    port: "",
    protocol: "tcp" as "tcp" | "udp" | "icmp" | "any",
    priority: 100,
    enabled: true,
  })
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRule: FirewallRule = {
      id: `rule-${Date.now()}`,
      ...formData,
      tags,
      createdAt: new Date(),
      modifiedAt: new Date(),
      version: 1,
    }

    onRuleCreated(newRule)
    onOpenChange(false)

    // Reset form
    setFormData({
      name: "",
      description: "",
      action: "allow",
      source: "",
      destination: "",
      port: "",
      protocol: "tcp",
      priority: 100,
      enabled: true,
    })
    setTags([])
    setTagInput("")
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Firewall Rule</DialogTitle>
          <DialogDescription>Add a new firewall rule to control network traffic</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Rule Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Allow HTTP Traffic"
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the purpose of this rule..."
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
                placeholder="e.g., 192.168.1.0/24 or any"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g., 10.0.0.0/8 or any"
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
                placeholder="e.g., 80, 443, any"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protocol">Protocol *</Label>
              <Select
                value={formData.protocol}
                onValueChange={(value: "tcp" | "udp" | "icmp" | "any") => setFormData({ ...formData, protocol: value })}
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
            <Label htmlFor="enabled">Enable rule immediately</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Rule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
