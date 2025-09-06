"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { DeviceDetailsPanel } from "./device-details-panel"
import type { NetworkTopology, NetworkDevice } from "@/types"

interface NetworkTopologyMapProps {
  topology: NetworkTopology
  filteredDevices: NetworkDevice[]
  selectedDevice: NetworkDevice | null
  onDeviceSelect: (device: NetworkDevice | null) => void
}

export function NetworkTopologyMap({
  topology,
  filteredDevices,
  selectedDevice,
  onDeviceSelect,
}: NetworkTopologyMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 3))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.3))
  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const getDeviceColor = (status: NetworkDevice["status"]) => {
    switch (status) {
      case "online":
        return "#10b981"
      case "warning":
        return "#f59e0b"
      case "error":
        return "#ef4444"
      case "offline":
        return "#6b7280"
      default:
        return "#6b7280"
    }
  }

  const getDeviceIcon = (type: NetworkDevice["type"]) => {
    switch (type) {
      case "firewall":
        return "🛡️"
      case "router":
        return "📡"
      case "switch":
        return "⚡"
      case "server":
        return "🖥️"
      default:
        return "📱"
    }
  }

  const isDeviceVisible = (device: NetworkDevice) => {
    return filteredDevices.some((d) => d.id === device.id)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Zoom: {Math.round(zoom * 100)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
            Online
          </Badge>
          <Badge variant="outline">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1" />
            Warning
          </Badge>
          <Badge variant="outline">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
            Error
          </Badge>
          <Badge variant="outline">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-1" />
            Offline
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Network Map */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="relative h-[600px] overflow-hidden bg-muted/20 rounded-lg">
              <svg
                ref={svgRef}
                className="w-full h-full cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                  {/* Subnet backgrounds */}
                  {topology.subnets.map((subnet) => {
                    const subnetDevices = topology.devices.filter((d) => subnet.deviceIds.includes(d.id))
                    if (subnetDevices.length === 0) return null

                    const minX = Math.min(...subnetDevices.map((d) => d.coordinates?.x || 0)) - 50
                    const maxX = Math.max(...subnetDevices.map((d) => d.coordinates?.x || 0)) + 50
                    const minY = Math.min(...subnetDevices.map((d) => d.coordinates?.y || 0)) - 50
                    const maxY = Math.max(...subnetDevices.map((d) => d.coordinates?.y || 0)) + 50

                    return (
                      <rect
                        key={subnet.id}
                        x={minX}
                        y={minY}
                        width={maxX - minX}
                        height={maxY - minY}
                        fill={subnet.color}
                        fillOpacity={0.1}
                        stroke={subnet.color}
                        strokeWidth={2}
                        strokeDasharray="5,5"
                        rx={10}
                      />
                    )
                  })}

                  {/* Connections */}
                  {topology.connections.map((connection) => {
                    const sourceDevice = topology.devices.find((d) => d.id === connection.sourceDeviceId)
                    const targetDevice = topology.devices.find((d) => d.id === connection.targetDeviceId)

                    if (!sourceDevice?.coordinates || !targetDevice?.coordinates) return null
                    if (!isDeviceVisible(sourceDevice) || !isDeviceVisible(targetDevice)) return null

                    return (
                      <line
                        key={connection.id}
                        x1={sourceDevice.coordinates.x}
                        y1={sourceDevice.coordinates.y}
                        x2={targetDevice.coordinates.x}
                        y2={targetDevice.coordinates.y}
                        stroke={connection.status === "active" ? "#10b981" : "#ef4444"}
                        strokeWidth={2}
                        opacity={0.7}
                      />
                    )
                  })}

                  {/* Devices */}
                  {topology.devices.map((device) => {
                    if (!device.coordinates || !isDeviceVisible(device)) return null

                    const isSelected = selectedDevice?.id === device.id

                    return (
                      <g key={device.id}>
                        {/* Device circle */}
                        <circle
                          cx={device.coordinates.x}
                          cy={device.coordinates.y}
                          r={isSelected ? 25 : 20}
                          fill={getDeviceColor(device.status)}
                          stroke={isSelected ? "#3b82f6" : "#ffffff"}
                          strokeWidth={isSelected ? 3 : 2}
                          className="cursor-pointer transition-all duration-200 hover:r-[22]"
                          onClick={() => onDeviceSelect(device)}
                        />

                        {/* Device icon */}
                        <text
                          x={device.coordinates.x}
                          y={device.coordinates.y + 5}
                          textAnchor="middle"
                          fontSize="16"
                          className="pointer-events-none select-none"
                        >
                          {getDeviceIcon(device.type)}
                        </text>

                        {/* Device label */}
                        <text
                          x={device.coordinates.x}
                          y={device.coordinates.y + 40}
                          textAnchor="middle"
                          fontSize="12"
                          fill="currentColor"
                          className="pointer-events-none select-none font-medium"
                        >
                          {device.name}
                        </text>

                        {/* IP address */}
                        <text
                          x={device.coordinates.x}
                          y={device.coordinates.y + 55}
                          textAnchor="middle"
                          fontSize="10"
                          fill="currentColor"
                          opacity={0.7}
                          className="pointer-events-none select-none"
                        >
                          {device.ip}
                        </text>
                      </g>
                    )
                  })}
                </g>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Device Details Panel */}
        <DeviceDetailsPanel device={selectedDevice} onClose={() => onDeviceSelect(null)} />
      </div>
    </div>
  )
}
