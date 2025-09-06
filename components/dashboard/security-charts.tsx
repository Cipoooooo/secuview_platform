"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid } from "recharts"

// Mock data for charts
const trafficData = [
  { time: "00:00", inbound: 2400, outbound: 1800, threats: 12 },
  { time: "04:00", inbound: 1398, outbound: 2100, threats: 8 },
  { time: "08:00", inbound: 9800, outbound: 7200, threats: 23 },
  { time: "12:00", inbound: 3908, outbound: 4800, threats: 15 },
  { time: "16:00", inbound: 4800, outbound: 3900, threats: 19 },
  { time: "20:00", inbound: 3800, outbound: 2800, threats: 7 },
]

const threatTrends = [
  { date: "Dec 3", malware: 45, phishing: 32, ddos: 18, bruteforce: 12 },
  { date: "Dec 4", malware: 52, phishing: 28, ddos: 22, bruteforce: 15 },
  { date: "Dec 5", malware: 38, phishing: 35, ddos: 15, bruteforce: 18 },
  { date: "Dec 6", malware: 48, phishing: 30, ddos: 25, bruteforce: 10 },
  { date: "Dec 7", malware: 42, phishing: 38, ddos: 20, bruteforce: 14 },
  { date: "Dec 8", malware: 55, phishing: 25, ddos: 28, bruteforce: 16 },
  { date: "Dec 9", malware: 35, phishing: 42, ddos: 18, bruteforce: 22 },
]

const threatDistribution = [
  { name: "Malware", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Phishing", value: 25, color: "hsl(var(--chart-2))" },
  { name: "DDoS", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Brute Force", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 5, color: "hsl(var(--chart-5))" },
]

const chartConfig = {
  inbound: { label: "Inbound Traffic", color: "hsl(var(--chart-1))" },
  outbound: { label: "Outbound Traffic", color: "hsl(var(--chart-2))" },
  threats: { label: "Threats Detected", color: "hsl(var(--chart-3))" },
  malware: { label: "Malware", color: "hsl(var(--chart-1))" },
  phishing: { label: "Phishing", color: "hsl(var(--chart-2))" },
  ddos: { label: "DDoS", color: "hsl(var(--chart-3))" },
  bruteforce: { label: "Brute Force", color: "hsl(var(--chart-4))" },
}

export function SecurityCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Network Traffic Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Network Traffic Overview</CardTitle>
          <CardDescription>Real-time inbound and outbound traffic monitoring</CardDescription>
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
          <CardDescription>Current breakdown of detected threats by category</CardDescription>
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

      {/* Threat Trends */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Threat Trends (7 Days)</CardTitle>
          <CardDescription>Historical view of threat detection patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={threatTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="malware" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="phishing" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="ddos" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="bruteforce" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
