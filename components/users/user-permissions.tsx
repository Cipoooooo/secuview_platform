"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Eye, FileText, Settings, Network, AlertTriangle, Users, Building } from "lucide-react"
import type { User } from "@/types"

interface UserPermissionsProps {
  role: User["role"]
}

const permissions = {
  admin: {
    label: "Administrator",
    description: "Full system access with all permissions",
    color: "default" as const,
    permissions: [
      { icon: Shield, label: "Full Dashboard Access", description: "View all security metrics and analytics" },
      { icon: Users, label: "User Management", description: "Create, edit, and delete user accounts" },
      { icon: Network, label: "Network Configuration", description: "Manage network topology and devices" },
      { icon: AlertTriangle, label: "Incident Management", description: "Full incident response and resolution" },
      { icon: Settings, label: "Firewall Rules", description: "Create and modify security policies" },
      { icon: FileText, label: "Audit Logs", description: "Access all system audit trails" },
      { icon: Building, label: "Tenant Management", description: "Manage multi-tenant configurations" },
      { icon: Settings, label: "System Settings", description: "Configure platform-wide settings" },
    ],
  },
  analyst: {
    label: "Security Analyst",
    description: "Security monitoring and incident analysis",
    color: "secondary" as const,
    permissions: [
      { icon: Shield, label: "Dashboard Access", description: "View security metrics and real-time data" },
      { icon: Eye, label: "Incident Monitoring", description: "Monitor and investigate security incidents" },
      { icon: Network, label: "Network Visibility", description: "View network topology and device status" },
      { icon: AlertTriangle, label: "Incident Response", description: "Respond to and update incident status" },
      { icon: FileText, label: "Log Analysis", description: "Search and analyze security logs" },
    ],
  },
  auditor: {
    label: "Compliance Auditor",
    description: "Read-only access for compliance and auditing",
    color: "outline" as const,
    permissions: [
      { icon: Eye, label: "Dashboard Viewing", description: "Read-only access to security dashboard" },
      { icon: FileText, label: "Audit Log Access", description: "View and export audit trails" },
      { icon: Shield, label: "Policy Review", description: "Review firewall rules and policies" },
      { icon: AlertTriangle, label: "Incident Review", description: "View incident reports and timelines" },
      { icon: Network, label: "Network Overview", description: "View network configuration and status" },
    ],
  },
}

export function UserPermissions({ role }: UserPermissionsProps) {
  const rolePermissions = permissions[role]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Role Permissions</CardTitle>
          <Badge variant={rolePermissions.color}>{rolePermissions.label}</Badge>
        </div>
        <CardDescription>{rolePermissions.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rolePermissions.permissions.map((permission, index) => (
            <div key={index}>
              <div className="flex items-start gap-3">
                <permission.icon className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <div className="font-medium">{permission.label}</div>
                  <div className="text-sm text-muted-foreground">{permission.description}</div>
                </div>
              </div>
              {index < rolePermissions.permissions.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
