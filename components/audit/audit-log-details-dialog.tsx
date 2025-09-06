"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Info, User, Globe, Monitor, Clock, Database, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"
import type { AuditLogEntry } from "@/types"

interface AuditLogDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  log: AuditLogEntry
  userName: string
}

export function AuditLogDetailsDialog({ open, onOpenChange, log, userName }: AuditLogDetailsDialogProps) {
  const [copied, setCopied] = useState(false)

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatUserAgent = (userAgent: string) => {
    if (userAgent.includes("Mozilla")) {
      if (userAgent.includes("Chrome")) return "Chrome Browser"
      if (userAgent.includes("Firefox")) return "Firefox Browser"
      if (userAgent.includes("Safari")) return "Safari Browser"
      return "Web Browser"
    }
    if (userAgent.includes("System")) return "System Process"
    if (userAgent.includes("curl")) return "API Client (curl)"
    return userAgent
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getSeverityIcon(log.severity)}
            Audit Log Details
            <Badge
              variant={log.severity === "error" ? "destructive" : log.severity === "warning" ? "secondary" : "default"}
            >
              {log.severity.toUpperCase()}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detailed information about this audit log entry and associated system activity
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Technical Details</TabsTrigger>
            <TabsTrigger value="context">Context & Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Event Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Timestamp:</span>
                      <span className="text-sm font-mono">{log.timestamp.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Action:</span>
                      <span className="text-sm">
                        {log.action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Resource:</span>
                      <Badge variant="outline">{log.resource}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Log ID:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{log.id}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(log.id)}
                          className="h-6 w-6 p-0"
                        >
                          {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">User:</span>
                      <span className="text-sm">{userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">User ID:</span>
                      <span className="text-sm font-mono">{log.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">IP Address:</span>
                      <span className="text-sm font-mono">{log.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Client:</span>
                      <span className="text-sm">{formatUserAgent(log.userAgent)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(log.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start">
                      <span className="text-sm font-medium capitalize">{key.replace(/_/g, " ")}:</span>
                      <span className="text-sm text-right max-w-xs break-words">
                        {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Technical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium">Full User Agent String:</label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <code className="text-sm break-all">{log.userAgent}</code>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Raw Event Data:</label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <pre className="text-sm overflow-x-auto">{JSON.stringify(log, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="context" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Security Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Risk Assessment</h4>
                    <p className="text-sm text-muted-foreground">
                      {log.severity === "error"
                        ? "High risk event requiring immediate attention. This activity may indicate a security breach or system compromise."
                        : log.severity === "warning"
                          ? "Medium risk event that should be monitored. This activity may require investigation or preventive action."
                          : "Low risk informational event. This is normal system activity for audit trail purposes."}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium">Compliance Impact</h4>
                    <p className="text-sm text-muted-foreground">
                      This event is logged for compliance with security audit requirements and regulatory frameworks
                      including SOX, GDPR, and industry-specific standards.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium">Recommended Actions</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {log.severity === "error" && (
                        <>
                          <li>• Investigate the source and cause of this event immediately</li>
                          <li>• Review related system logs and user activities</li>
                          <li>• Consider implementing additional security measures</li>
                        </>
                      )}
                      {log.severity === "warning" && (
                        <>
                          <li>• Monitor for similar events or patterns</li>
                          <li>• Review user permissions and access controls</li>
                          <li>• Consider updating security policies if needed</li>
                        </>
                      )}
                      {log.severity === "info" && (
                        <>
                          <li>• No immediate action required</li>
                          <li>• Event logged for audit trail completeness</li>
                          <li>• Review periodically as part of security assessments</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => copyToClipboard(JSON.stringify(log, null, 2))}>
            {copied ? <CheckCircle className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            Copy Log Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
