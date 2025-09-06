"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Shield, Router, Zap, Server, MapPin, Clock } from "lucide-react"
import type { NetworkDevice } from "@/types"

interface DeviceListProps {
  devices: NetworkDevice[]
  onDeviceSelect: (device: NetworkDevice) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  typeFilter: string
  onTypeFilterChange: (type: string) => void
}

export function DeviceList({
  devices,
  onDeviceSelect,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
}: DeviceListProps) {
  const getDeviceIcon = (type: NetworkDevice["type"]) => {
    switch (type) {
      case "firewall":
        return Shield
      case "router":
        return Router
      case "switch":
        return Zap
      case "server":
        return Server
      default:
        return Server
    }
  }

  const getStatusBadgeVariant = (status: NetworkDevice["status"]) => {
    switch (status) {
      case "online":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      case "offline":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Devices</CardTitle>
        <CardDescription>Detailed list of all network devices and their status</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
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

        {/* Device Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => {
              const Icon = getDeviceIcon(device.type)
              return (
                <TableRow key={device.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm text-muted-foreground">{device.ip}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {device.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(device.status)}>{device.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {device.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    {device.metrics ? (
                      <div className="text-sm">
                        <div>CPU: {device.metrics.cpuUsage}%</div>
                        <div className="text-muted-foreground">Mem: {device.metrics.memoryUsage}%</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {device.lastSeen.toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => onDeviceSelect(device)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
