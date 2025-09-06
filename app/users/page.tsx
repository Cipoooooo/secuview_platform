"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Search, MoreHorizontal, UserPlus, Shield, Eye, Settings } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { mockUsers } from "@/lib/mock-data"
import type { User } from "@/types"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "default"
      case "analyst":
        return "secondary"
      case "auditor":
        return "outline"
      default:
        return "secondary"
    }
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user)))
  }

  const handleAddUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email || "",
      name: userData.name || "",
      role: userData.role || "analyst",
      tenantId: "tenant-1",
      avatar: `/placeholder.svg?height=40&width=40&query=${userData.name}`,
      lastLogin: new Date(),
      isActive: true,
    }
    setUsers([...users, newUser])
    setIsAddUserOpen(false)
  }

  const handleEditUser = (userData: Partial<User>) => {
    if (!editingUser) return
    setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...userData } : user)))
    setEditingUser(null)
  }

  const activeUsers = users.filter((user) => user.isActive).length
  const adminUsers = users.filter((user) => user.role === "admin").length
  const analystUsers = users.filter((user) => user.role === "analyst").length
  const auditorUsers = users.filter((user) => user.role === "auditor").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage users, roles, and permissions for your organization</p>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <UserDialog onSubmit={handleAddUser} />
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">{activeUsers} active users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminUsers}</div>
              <p className="text-xs text-muted-foreground">Full system access</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analysts</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analystUsers}</div>
              <p className="text-xs text-muted-foreground">Security monitoring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auditors</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auditorUsers}</div>
              <p className="text-xs text-muted-foreground">Compliance review</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                  <SelectItem value="auditor">Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={user.isActive} onCheckedChange={() => toggleUserStatus(user.id)} />
                        <span className="text-sm">{user.isActive ? "Active" : "Inactive"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.lastLogin?.toLocaleDateString()} at {user.lastLogin?.toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setEditingUser(user)}>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        {editingUser && (
          <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
            <UserDialog user={editingUser} onSubmit={handleEditUser} isEditing />
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  )
}

interface UserDialogProps {
  user?: User
  onSubmit: (userData: Partial<User>) => void
  isEditing?: boolean
}

function UserDialog({ user, onSubmit, isEditing = false }: UserDialogProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || ("analyst" as User["role"]),
    isActive: user?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    if (!isEditing) {
      setFormData({ name: "", email: "", role: "analyst", isActive: true })
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update user information and permissions."
            : "Create a new user account with appropriate role and permissions."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value: User["role"]) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
                <SelectItem value="auditor">Auditor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isEditing && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Active
              </Label>
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit">{isEditing ? "Update User" : "Create User"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
