"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, Activity, Server, TrendingUp, TrendingDown, Network } from "lucide-react"
import type { DashboardMetrics } from "@/types"

interface MetricsCardsProps {
  metrics: DashboardMetrics
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: "Attacks Blocked",
      value: metrics.attacksBlocked.toLocaleString(),
      icon: Shield,
      trend: { value: "+12%", positive: true, label: "from last hour" },
    },
    {
      title: "Traffic Volume",
      value: `${metrics.trafficVolume} TB`,
      icon: Activity,
      trend: { value: "-3%", positive: false, label: "from yesterday" },
    },
    {
      title: "Active Threats",
      value: metrics.activeThreats,
      icon: AlertTriangle,
      trend: { value: "5 critical", positive: false, label: "incidents" },
      valueColor: "text-red-600",
    },
    {
      title: "System Health",
      value: `${metrics.systemHealth}%`,
      icon: Server,
      progress: metrics.systemHealth,
    },
    {
      title: "Connected Devices",
      value: metrics.connectedDevices,
      icon: Network,
      trend: { value: "+2", positive: true, label: "new devices" },
    },
    {
      title: "Anomalies Detected",
      value: metrics.anomaliesDetected,
      icon: AlertTriangle,
      trend: { value: "-15%", positive: true, label: "from last week" },
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.valueColor || ""}`}>{card.value}</div>
            {card.progress !== undefined && <Progress value={card.progress} className="mt-2" />}
            {card.trend && (
              <p className="text-xs text-muted-foreground">
                <span className={`flex items-center ${card.trend.positive ? "text-green-600" : "text-red-600"}`}>
                  {card.trend.positive ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {card.trend.value} {card.trend.label}
                </span>
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
