"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UserPermissions } from "@/components/users/user-permissions"
import { RoleComparison } from "@/components/users/role-comparison"

export default function RolesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground">Understand the different user roles and their associated permissions</p>
        </div>

        {/* Role Comparison */}
        <RoleComparison />

        {/* Individual Role Permissions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <UserPermissions role="admin" />
          <UserPermissions role="analyst" />
          <UserPermissions role="auditor" />
        </div>
      </div>
    </DashboardLayout>
  )
}
