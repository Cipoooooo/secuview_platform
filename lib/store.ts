import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Tenant, SecurityIncident, NetworkDevice } from "@/types"

interface AuthState {
  user: User | null
  tenant: Tenant | null
  isAuthenticated: boolean
  login: (user: User, tenant: Tenant) => void
  logout: () => void
}

interface DashboardState {
  incidents: SecurityIncident[]
  devices: NetworkDevice[]
  selectedIncident: SecurityIncident | null
  setIncidents: (incidents: SecurityIncident[]) => void
  setDevices: (devices: NetworkDevice[]) => void
  setSelectedIncident: (incident: SecurityIncident | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tenant: null,
      isAuthenticated: false,
      login: (user, tenant) => set({ user, tenant, isAuthenticated: true }),
      logout: () => set({ user: null, tenant: null, isAuthenticated: false }),
    }),
    {
      name: "secuview-auth",
    },
  ),
)

export const useDashboardStore = create<DashboardState>((set) => ({
  incidents: [],
  devices: [],
  selectedIncident: null,
  setIncidents: (incidents) => set({ incidents }),
  setDevices: (devices) => set({ devices }),
  setSelectedIncident: (incident) => set({ selectedIncident: incident }),
}))
