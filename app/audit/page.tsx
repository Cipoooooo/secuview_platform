"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Search,
  FileText,
  Download,
  Filter,
  CalendarIcon,
  Activity,
  AlertTriangle,
  Info,
  Eye,
  User,
  Shield,
  Network,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { mockAuditLogs, mockUsers } from "@/lib/mock-data"
import { AuditLogDetailsDialog } from "@/components/audit/audit-log-details-dialog"
import type { AuditLogEntry } from "@/types"

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(mockAuditLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [resourceFilter, setResourceFilter] = useState<string>("all")
  const [userFilter, setUserFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter
    const matchesResource = resourceFilter === "all" || log.resource === resourceFilter
    const matchesUser = userFilter === "all" || log.userId === userFilter

    const matchesDateRange =
      (!dateRange.from || log.timestamp >= dateRange.from) && (!dateRange.to || log.timestamp <= dateRange.to)

    return matchesSearch && matchesSeverity && matchesResource && matchesUser && matchesDateRange
  })

  const getUserName = (userId: string) => {
    if (userId === "unknown") return "Unknown User"
    const user = mockUsers.find((u) => u.id === userId)
    return user?.name || `User ${userId}`
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes("login") || action.includes("auth")) return <User className="h-4 w-4" />
    if (action.includes("firewall") || action.includes("rule")) return <Shield className="h-4 w-4" />
    if (action.includes("network") || action.includes("device")) return <Network className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  const exportLogs = (format: "csv" | "json") => {
    const dataStr =
      format === "json"
        ? JSON.stringify(filteredLogs, null, 2)
        : [
            "Timestamp,User,Action,Resource,Severity,IP Address",
            ...filteredLogs.map(
              (log) =>
                `${log.timestamp.toISOString()},${getUserName(log.userId)},${log.action},${log.resource},${log.severity},${log.ip}`,
            ),
          ].join("\n")

    const dataBlob = new Blob([dataStr], { type: format === "json" ? "application/json" : "text/csv" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `audit-logs-${new Date().toISOString().split("T")[0]}.${format}`
    link.click()
    URL.revokeObjectURL(url)
  }

  const totalLogs = logs.length
  const errorLogs = logs.filter((log) => log.severity === "error").length
  const warningLogs = logs.filter((log) => log.severity === "warning").length
  const todayLogs = logs.filter((log) => {
    const today = new Date()
    return log.timestamp.toDateString() === today.toDateString()
  }).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">Monitor and track all system activities and user actions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportLogs("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => exportLogs("json")}>
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogs}</div>
            <p className="text-xs text-muted-foreground">{todayLogs} logged today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorLogs}</div>
            <p className="text-xs text-muted-foreground">Critical security events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningLogs}</div>
            <p className="text-xs text-muted-foreground">Attention required</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">Audit trail coverage</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="analytics">Log Analytics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Audit Logs</CardTitle>
              <CardDescription>Search and filter system audit logs by various criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search logs by action, resource, or details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-5">
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={resourceFilter} onValueChange={setResourceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Resource" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Resources</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                      <SelectItem value="firewall_rules">Firewall Rules</SelectItem>
                      <SelectItem value="incidents">Incidents</SelectItem>
                      <SelectItem value="users">Users</SelectItem>
                      <SelectItem value="network_devices">Network Devices</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="User" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="unknown">Unknown User</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !dateRange.from && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          "Pick a date range"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSeverityFilter("all")
                      setResourceFilter("all")
                      setUserFilter("all")
                      setDateRange({})
                    }}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>System Audit Trail ({filteredLogs.length})</CardTitle>
              <CardDescription>Comprehensive log of all system activities and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedLog(log)
                        setShowDetailsDialog(true)
                      }}
                    >
                      <TableCell className="font-mono text-sm">{log.timestamp.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(log.severity)}
                          <Badge
                            variant={
                              log.severity === "error"
                                ? "destructive"
                                : log.severity === "warning"
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {log.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{getUserName(log.userId)}</div>
                        <div className="text-sm text-muted-foreground">ID: {log.userId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className="font-medium">
                            {log.action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.resource}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {Object.entries(log.details)
                          .map(([key, value]) => (
                            <span key={key} className="text-sm text-muted-foreground">
                              {key}: {String(value)}
                            </span>
                          ))
                          .slice(0, 1)}
                        {Object.keys(log.details).length > 1 && (
                          <span className="text-sm text-muted-foreground">
                            {" "}
                            +{Object.keys(log.details).length - 1} more
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log Analytics</CardTitle>
              <CardDescription>Statistical analysis and trends of audit log data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Log analytics dashboard with charts showing activity trends, user behavior patterns, and security event
                analysis will be displayed here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>Generate compliance reports for regulatory requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Compliance reporting tools for SOX, GDPR, HIPAA, and other regulatory frameworks will be available here
                with automated report generation.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedLog && (
        <AuditLogDetailsDialog
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          log={selectedLog}
          userName={getUserName(selectedLog.userId)}
        />
      )}
    </div>
  )
}
