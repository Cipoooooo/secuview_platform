"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Shield, Activity, AlertTriangle, CheckCircle, Edit, Trash2 } from "lucide-react"
import { mockFirewallRules } from "@/lib/mock-data"
import { CreateFirewallRuleDialog } from "@/components/firewall/create-firewall-rule-dialog"
import { FirewallRuleDetailsDialog } from "@/components/firewall/firewall-rule-details-dialog"
import type { FirewallRule } from "@/types"

export default function FirewallPage() {
  const [rules, setRules] = useState<FirewallRule[]>(mockFirewallRules)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [selectedRule, setSelectedRule] = useState<FirewallRule | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.destination.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "enabled" && rule.enabled) ||
      (statusFilter === "disabled" && !rule.enabled)
    const matchesAction = actionFilter === "all" || rule.action === actionFilter

    return matchesSearch && matchesStatus && matchesAction
  })

  const toggleRuleStatus = (ruleId: string) => {
    setRules(rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId))
  }

  const handleRuleCreated = (newRule: FirewallRule) => {
    setRules([...rules, newRule])
  }

  const activeRules = rules.filter((rule) => rule.enabled).length
  const allowRules = rules.filter((rule) => rule.action === "allow").length
  const denyRules = rules.filter((rule) => rule.action === "deny").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Firewall Rules</h1>
          <p className="text-muted-foreground">Manage and monitor your network security rules</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeRules} active, {rules.length - activeRules} disabled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allow Rules</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allowRules}</div>
            <p className="text-xs text-muted-foreground">Permissive rules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deny Rules</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{denyRules}</div>
            <p className="text-xs text-muted-foreground">Blocking rules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rule Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">Rules functioning properly</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Rules Management</TabsTrigger>
          <TabsTrigger value="analytics">Rule Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Rules</CardTitle>
              <CardDescription>Search and filter firewall rules by various criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search rules by name, source, or destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="deny">Deny</SelectItem>
                    <SelectItem value="log">Log</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Rules Table */}
          <Card>
            <CardHeader>
              <CardTitle>Firewall Rules ({filteredRules.length})</CardTitle>
              <CardDescription>Manage your network security rules and policies</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Port</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.priority}</TableCell>
                      <TableCell>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Modified {rule.modifiedAt.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            rule.action === "allow" ? "default" : rule.action === "deny" ? "destructive" : "secondary"
                          }
                        >
                          {rule.action.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{rule.source}</TableCell>
                      <TableCell className="font-mono text-sm">{rule.destination}</TableCell>
                      <TableCell className="font-mono text-sm">{rule.port}</TableCell>
                      <TableCell className="uppercase">{rule.protocol}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch checked={rule.enabled} onCheckedChange={() => toggleRuleStatus(rule.id)} />
                          <span className="text-sm">{rule.enabled ? "Enabled" : "Disabled"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRule(rule)
                              setShowDetailsDialog(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteRule(rule.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
              <CardTitle>Rule Analytics</CardTitle>
              <CardDescription>Performance metrics and usage statistics for firewall rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Rule analytics and performance metrics will be displayed here. This includes rule hit counts,
                performance impact, and optimization suggestions.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateFirewallRuleDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onRuleCreated={handleRuleCreated}
      />

      {selectedRule && (
        <FirewallRuleDetailsDialog
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          rule={selectedRule}
          onRuleUpdated={(updatedRule) => {
            setRules(rules.map((rule) => (rule.id === updatedRule.id ? updatedRule : rule)))
          }}
        />
      )}
    </div>
  )
}
