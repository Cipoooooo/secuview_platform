"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Zap, Server, Shield, Router, RefreshCw, Activity } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NetworkTopologyMap } from "@/components/network/network-topology-map"
import { DeviceList } from "@/components/network/device-list"
import { NetworkMetrics } from "@/components/network/network-metrics"
import { mockTopology } from "@/lib/mock-data"
import type { NetworkDevice } from "@/types"

export default function NetworkPage() {
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredDevices = mockTopology.devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip.includes(searchTerm) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || device.status === statusFilter
    const matchesType = typeFilter === "all" || device.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const deviceCounts = {
    total: mockTopology.devices.length,
    online: mockTopology.devices.filter((d) => d.status === "online").length,
    warning: mockTopology.devices.filter((d) => d.status === "warning").length,
    offline: mockTopology.devices.filter((d) => d.status === "offline").length,
    error: mockTopology.devices.filter((d) => d.status === "error").length,
  }

  const deviceTypeIcons = {
    firewall: Shield,
    router: Router,
    switch: Zap,
    server: Server,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Network Topology</h1>
            <p className="text-muted-foreground">Interactive network map and device monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Activity className="mr-1 h-3 w-3" />
              {deviceCounts.online}/{deviceCounts.total} Online
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Network Metrics */}
        <NetworkMetrics devices={mockTopology.devices} />

        {/* Main Content */}
        <Tabs defaultValue="topology" className="space-y-6">
          <TabsList>
            <TabsTrigger value="topology">Network Map</TabsTrigger>
            <TabsTrigger value="devices">Device List</TabsTrigger>
            <TabsTrigger value="subnets">Subnets</TabsTrigger>
          </TabsList>

          <TabsContent value="topology" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Network Topology Map</CardTitle>
                <CardDescription>Interactive visualization of your network infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search devices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="firewall">Firewall</SelectItem>
                      <SelectItem value="router">Router</SelectItem>
                      <SelectItem value="switch">Switch</SelectItem>
                      <SelectItem value="server">Server</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Network Topology Visualization */}
                <NetworkTopologyMap
                  topology={mockTopology}
                  filteredDevices={filteredDevices}
                  selectedDevice={selectedDevice}
                  onDeviceSelect={setSelectedDevice}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices">
            <DeviceList
              devices={filteredDevices}
              onDeviceSelect={setSelectedDevice}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
            />
          </TabsContent>

          <TabsContent value="subnets">
            <div className="grid gap-6 md:grid-cols-2">
              {mockTopology.subnets.map((subnet) => (
                <Card key={subnet.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: subnet.color }} />
                      <CardTitle>{subnet.name}</CardTitle>
                      {subnet.vlan && <Badge variant="outline">VLAN {subnet.vlan}</Badge>}
                    </div>
                    <CardDescription>{subnet.cidr}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Connected Devices ({subnet.deviceIds.length})</div>
                      {subnet.deviceIds.map((deviceId) => {
                        const device = mockTopology.devices.find((d) => d.id === deviceId)
                        if (!device) return null
                        const Icon = deviceTypeIcons[device.type]
                        return (
                          <div key={deviceId} className="flex items-center gap-2 text-sm">
                            <Icon className="h-4 w-4" />
                            <span>{device.name}</span>
                            <Badge variant="outline" className="ml-auto">
                              {device.ip}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
