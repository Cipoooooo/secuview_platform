"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { X, MapPin, Clock, Thermometer, Cpu, HardDrive, Wifi } from "lucide-react"
import type { NetworkDevice } from "@/types"

interface DeviceDetailsPanelProps {
  device: NetworkDevice | null
  onClose: () => void
}

export function DeviceDetailsPanel({ device, onClose }: DeviceDetailsPanelProps) {
  if (!device) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device Details</CardTitle>
          <CardDescription>Select a device from the network map to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Click on any device in the network map to see its details, metrics, and configuration.
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: NetworkDevice["status"]) => {
    switch (status) {
      case "online":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      case "offline":
        return "text-gray-600"
      default:
        return "text-gray-600"
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {device.name}
              <Badge variant={getStatusBadgeVariant(device.status)}>{device.status}</Badge>
            </CardTitle>
            <CardDescription>
              {device.type} • {device.ip}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{device.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Last seen: {device.lastSeen.toLocaleString()}</span>
          </div>
          {device.firmwareVersion && (
            <div className="text-sm">
              <span className="text-muted-foreground">Firmware:</span> {device.firmwareVersion}
            </div>
          )}
        </div>

        <Separator />

        {/* Metrics */}
        {device.metrics && (
          <div className="space-y-4">
            <h4 className="font-medium">Performance Metrics</h4>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-1">
                    <Cpu className="h-3 w-3" />
                    CPU Usage
                  </span>
                  <span>{device.metrics.cpuUsage}%</span>
                </div>
                <Progress value={device.metrics.cpuUsage} />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3" />
                    Memory Usage
                  </span>
                  <span>{device.metrics.memoryUsage}%</span>
                </div>
                <Progress value={device.metrics.memoryUsage} />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    Bandwidth
                  </span>
                  <span>{device.metrics.bandwidth} Mbps</span>
                </div>
                <Progress value={(device.metrics.bandwidth / 1000) * 100} />
              </div>

              {device.metrics.temperature && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      Temperature
                    </span>
                    <span>{device.metrics.temperature}°C</span>
                  </div>
                  <Progress value={(device.metrics.temperature / 80) * 100} />
                </div>
              )}

              <div className="text-sm">
                <span className="text-muted-foreground">Uptime:</span> {device.metrics.uptime}%
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Ports */}
        {device.ports && device.ports.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Network Ports</h4>
            <div className="space-y-2">
              {device.ports.map((port) => (
                <div key={port.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        port.status === "up" ? "bg-green-500" : port.status === "down" ? "bg-red-500" : "bg-gray-500"
                      }`}
                    />
                    <span>{port.name}</span>
                  </div>
                  <div className="text-right">
                    <div>{port.speed}</div>
                    {port.connectedTo && <div className="text-xs text-muted-foreground">→ {port.connectedTo}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full bg-transparent">
            Configure Device
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            View Logs
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            Run Diagnostics
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
