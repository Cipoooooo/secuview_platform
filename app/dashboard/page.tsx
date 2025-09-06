"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid } from "recharts"
import { Shield, AlertTriangle, Activity, Server, TrendingUp, TrendingDown, Eye, MapPin } from "lucide-react"
import { mockMetrics, mockIncidents, mockDevices } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

// Mock chart data
const trafficData = [
  { time: "00:00", inbound: 2400, outbound: 1800, threats: 12 },
  { time: "04:00", inbound: 1398, outbound: 2100, threats: 8 },
  { time: "08:00", inbound: 9800, outbound: 7200, threats: 23 },
  { time: "12:00", inbound: 3908, outbound: 4800, threats: 15 },
  { time: "16:00", inbound: 4800, outbound: 3900, threats: 19 },
  { time: "20:00", inbound: 3800, outbound: 2800, threats: 7 },
]

const threatDistribution = [
  { name: "Malware", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Phishing", value: 25, color: "hsl(var(--chart-2))" },
  { name: "DDoS", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Brute Force", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 5, color: "hsl(var(--chart-5))" },
]

const chartConfig = {
  inbound: {
    label: "Inbound Traffic",
    color: "hsl(var(--chart-1))",
  },
  outbound: {
    label: "Outbound Traffic",
    color: "hsl(var(--chart-2))",
  },
  threats: {
    label: "Threats Detected",
    color: "hsl(var(--chart-3))",
  },
}

export default function DashboardPage() {
  const criticalIncidents = mockIncidents.filter((incident) => incident.severity === "critical")
  const onlineDevices = mockDevices.filter((device) => device.status === "online").length
  const totalDevices = mockDevices.length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
            <p className="text-muted-foreground">Real-time network security monitoring and analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Activity className="mr-1 h-3 w-3" />
              System Healthy
            </Badge>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attacks Blocked</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.attacksBlocked.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +12% from last hour
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Traffic Volume</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.trafficVolume} TB</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600 flex items-center">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  -3% from yesterday
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{mockMetrics.activeThreats}</div>
              <p className="text-xs text-muted-foreground">{criticalIncidents.length} critical incidents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.systemHealth}%</div>
              <Progress value={mockMetrics.systemHealth} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Traffic Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Network Traffic Overview</CardTitle>
              <CardDescription>Real-time inbound and outbound traffic with threat detection</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <AreaChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="inbound"
                    stackId="1"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="outbound"
                    stackId="1"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Threat Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Threat Distribution</CardTitle>
              <CardDescription>Breakdown of detected threats by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={threatDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {threatDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Incidents */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Security Incidents</CardTitle>
              <CardDescription>Latest security events requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockIncidents.slice(0, 3).map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={incident.severity === "critical" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {incident.severity}
                        </Badge>
                        <span className="font-medium">{incident.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{incident.detectedAt.toLocaleTimeString()}</span>
                        <span>Status: {incident.status}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Investigate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Network Status */}
          <Card>
            <CardHeader>
              <CardTitle>Network Status</CardTitle>
              <CardDescription>Connected devices and locations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connected Devices</span>
                <span className="text-2xl font-bold">
                  {onlineDevices}/{totalDevices}
                </span>
              </div>
              <Progress value={(onlineDevices / totalDevices) * 100} />

              <div className="space-y-3">
                {mockDevices.slice(0, 4).map((device) => (
                  <div key={device.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          device.status === "online"
                            ? "bg-green-500"
                            : device.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm">{device.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {device.location}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
