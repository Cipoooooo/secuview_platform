"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Shield,
  Users,
  Network,
  AlertTriangle,
  FileText,
  Settings,
  Building,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Network Map", href: "/network", icon: Network },
  { name: "Firewall Rules", href: "/firewall", icon: Shield },
  { name: "Users & Roles", href: "/users", icon: Users },
  { name: "Audit Logs", href: "/audit", icon: FileText },
  { name: "Tenants", href: "/tenants", icon: Building },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn("flex h-full flex-col border-r bg-sidebar", className)}>
      <div className="flex h-14 items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-sidebar-primary" />
            <span className="font-semibold text-sidebar-foreground">SecuView</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1 py-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    collapsed && "px-2",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}
