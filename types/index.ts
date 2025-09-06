// Core types for SecuView platform

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "analyst" | "auditor"
  tenantId: string
  avatar?: string
  lastLogin?: Date
  isActive: boolean
}

export interface Tenant {
  id: string
  name: string
  domain: string
  plan: "starter" | "professional" | "enterprise"
  createdAt: Date
  isActive: boolean
  settings: TenantSettings
}

export interface TenantSettings {
  ssoEnabled: boolean
  ssoProvider?: "google" | "azure"
  maxUsers: number
  retentionDays: number
  alertsEnabled: boolean
}

export interface SecurityIncident {
  id: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "investigating" | "resolved" | "closed"
  description: string
  detectedAt: Date
  resolvedAt?: Date
  assignedTo?: string
  tags: string[]
  affectedAssets: string[]
  timeline?: IncidentTimelineEntry[]
  attachments?: IncidentAttachment[]
}

export interface IncidentTimelineEntry {
  id: string
  timestamp: Date
  userId: string
  action: string
  description: string
  type: "status_change" | "assignment" | "comment" | "evidence" | "action_taken"
}

export interface IncidentAttachment {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: Date
  uploadedBy: string
  url: string
}

export interface NetworkDevice {
  id: string
  name: string
  type: "firewall" | "router" | "switch" | "server"
  ip: string
  location: string
  status: "online" | "offline" | "warning" | "error"
  lastSeen: Date
  firmwareVersion?: string
  coordinates?: { x: number; y: number }
  connections?: string[]
  ports?: NetworkPort[]
  metrics?: DeviceMetrics
}

export interface NetworkPort {
  id: string
  name: string
  type: "ethernet" | "fiber" | "wireless"
  status: "up" | "down" | "disabled"
  speed: string
  connectedTo?: string
}

export interface DeviceMetrics {
  cpuUsage: number
  memoryUsage: number
  bandwidth: number
  uptime: number
  temperature?: number
}

export interface NetworkConnection {
  id: string
  sourceDeviceId: string
  targetDeviceId: string
  sourcePort?: string
  targetPort?: string
  connectionType: "ethernet" | "fiber" | "wireless" | "vpn"
  bandwidth: string
  status: "active" | "inactive" | "error"
}

export interface NetworkTopology {
  devices: NetworkDevice[]
  connections: NetworkConnection[]
  subnets: NetworkSubnet[]
}

export interface NetworkSubnet {
  id: string
  name: string
  cidr: string
  vlan?: number
  deviceIds: string[]
  color?: string
}

export interface DashboardMetrics {
  attacksBlocked: number
  trafficVolume: number
  anomaliesDetected: number
  activeThreats: number
  systemHealth: number
  connectedDevices: number
}

export interface FirewallRule {
  id: string
  name: string
  action: "allow" | "deny" | "log"
  source: string
  destination: string
  port: string
  protocol: "tcp" | "udp" | "icmp" | "any"
  enabled: boolean
  priority: number
  createdAt: Date
  modifiedAt: Date
  version: number
  description?: string
  tags?: string[]
}

export interface AuditLogEntry {
  id: string
  timestamp: Date
  userId: string
  action: string
  resource: string
  details: Record<string, any>
  ip: string
  userAgent: string
  severity: "info" | "warning" | "error"
}
