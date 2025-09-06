"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Router, Zap, Server, Activity, AlertTriangle, CheckCircle } from "lucide-react"
import type { NetworkDevice } from "@/types"

interface NetworkMetricsProps {
  devices: NetworkDevice[]
}

export function NetworkMetrics({ devices }: NetworkMetricsProps) {
  const deviceCounts = {
    total: devices.length,
    online: devices.filter((d) => d.status === "online").length,
    warning: devices.filter((d) => d.status === "warning").length,
    offline: devices.filter((d) => d.status === "offline").length,
    error: devices.filter((d) => d.status === "error").length,
  }

  const typeCounts = {
    firewall: devices.filter((d) => d.type === "firewall").length,
    router: devices.filter((d) => d.type === "router").length,
    switch: devices.filter((d) => d.type === "switch").length,
    server: devices.filter((d) => d.type === "server").length,
  }

  const healthPercentage = (deviceCounts.online / deviceCounts.total) * 100

  const avgMetrics = {
    cpu: devices.reduce((acc, d) => acc + (d.metrics?.cpuUsage || 0), 0) / devices.length,
    memory: devices.reduce((acc, d) => acc + (d.metrics?.memoryUsage || 0), 0) / devices.length,
    uptime: devices.reduce((acc, d) => acc + (d.metrics?.uptime || 0), 0) / devices.length,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Network Health */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network Health</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(healthPercentage)}%</div>
          <Progress value={healthPercentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {deviceCounts.online} of {deviceCounts.total} devices online
          </p>
        </CardContent>
      </Card>

      {/* Device Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Device Status</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Online
              </span>
              <span>{deviceCounts.online}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                Warning
              </span>
              <span>{deviceCounts.warning}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Error
              </span>
              <span>{deviceCounts.error}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                Offline
              </span>
              <span>{deviceCounts.offline}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Types */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Device Types</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Firewalls
              </span>
              <span>{typeCounts.firewall}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Router className="h-3 w-3" />
                Routers
              </span>
              <span>{typeCounts.router}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Switches
              </span>
              <span>{typeCounts.switch}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Server className="h-3 w-3" />
                Servers
              </span>
              <span>{typeCounts.server}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>CPU Usage</span>
                <span>{Math.round(avgMetrics.cpu)}%</span>
              </div>
              <Progress value={avgMetrics.cpu} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Memory</span>
                <span>{Math.round(avgMetrics.memory)}%</span>
              </div>
              <Progress value={avgMetrics.memory} />
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Avg Uptime:</span> {avgMetrics.uptime.toFixed(1)}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
