"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

const features = [
  { name: "Dashboard Access", admin: true, analyst: true, auditor: true },
  { name: "User Management", admin: true, analyst: false, auditor: false },
  { name: "Create Incidents", admin: true, analyst: true, auditor: false },
  { name: "Resolve Incidents", admin: true, analyst: true, auditor: false },
  { name: "Firewall Rules", admin: true, analyst: false, auditor: false },
  { name: "Network Config", admin: true, analyst: false, auditor: false },
  { name: "Audit Logs", admin: true, analyst: true, auditor: true },
  { name: "System Settings", admin: true, analyst: false, auditor: false },
  { name: "Tenant Management", admin: true, analyst: false, auditor: false },
]

export function RoleComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Comparison</CardTitle>
        <CardDescription>Compare permissions across different user roles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Feature</th>
                <th className="text-center py-2 px-4">
                  <Badge variant="default">Admin</Badge>
                </th>
                <th className="text-center py-2 px-4">
                  <Badge variant="secondary">Analyst</Badge>
                </th>
                <th className="text-center py-2 px-4">
                  <Badge variant="outline">Auditor</Badge>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{feature.name}</td>
                  <td className="text-center py-3 px-4">
                    {feature.admin ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-600 mx-auto" />
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {feature.analyst ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-600 mx-auto" />
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {feature.auditor ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
