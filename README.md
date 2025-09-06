# SecuView - Enterprise Network Security Platform

<div align="center">
  <img src="public/professional-avatar.png" alt="SecuView Logo" width="120" height="120">
  
  **Centralized Multi-Tenant Platform for Enterprise Network Security Management**
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
</div>

## 🚀 Overview

SecuView is a comprehensive SaaS platform designed for enterprise network security management. It provides organizations with centralized visibility and control over their network security infrastructure through an intuitive, multi-tenant interface.

### ✨ Key Features

- **🔐 Multi-Tenant Authentication** - Role-based access control with SSO support
- **📊 Real-Time Security Dashboard** - Live metrics, charts, and threat monitoring
- **👥 User & Role Management** - Granular permission system for teams
- **🗺️ Interactive Network Topology** - Visual network mapping with device monitoring
- **🚨 Incident Management** - Complete incident tracking and forensic analysis
- **🛡️ Firewall Rules Editor** - Advanced firewall configuration and management
- **📋 Comprehensive Audit Logs** - Full activity tracking with compliance reporting
- **🌙 Dark/Light Mode** - Professional UI with theme switching

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State Management:** Zustand
- **Charts:** Recharts
- **Icons:** Lucide React
- **Fonts:** Geist Sans & Geist Mono

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/secuview-platform.git
   cd secuview-platform
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit `.env.local` with your configuration:
   \`\`\`env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   # Add your database and auth configurations
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
secuview-platform/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard
│   ├── users/            # User management
│   ├── network/          # Network topology
│   ├── incidents/        # Incident management
│   ├── firewall/         # Firewall rules
│   └── audit/            # Audit logs
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard-specific components
│   ├── users/            # User management components
│   ├── network/          # Network visualization components
│   ├── incidents/        # Incident management components
│   ├── firewall/         # Firewall management components
│   └── audit/            # Audit log components
├── lib/                  # Utility functions and configurations
│   ├── store.ts          # Zustand state management
│   ├── mock-data.ts      # Development mock data
│   └── utils.ts          # Helper utilities
├── types/                # TypeScript type definitions
└── public/               # Static assets
\`\`\`

## 🎯 Core Modules

### 🔐 Authentication & Authorization
- Multi-tenant user authentication
- Role-based access control (Admin, Analyst, Auditor)
- SSO integration ready
- Session management

### 📊 Security Dashboard
- Real-time threat monitoring
- Interactive security metrics
- Network traffic analysis
- System health indicators

### 🗺️ Network Topology
- Interactive network visualization
- Device status monitoring
- Subnet management
- Connection mapping

### 🚨 Incident Management
- Security incident tracking
- Timeline and forensic analysis
- Severity classification
- Assignment and workflow management

### 🛡️ Firewall Management
- Rule creation and editing
- Priority management
- Protocol configuration
- Rule validation and testing

### 📋 Audit & Compliance
- Comprehensive activity logging
- Advanced search and filtering
- Compliance reporting
- Data export capabilities

## 🛠️ Development

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
\`\`\`

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Conventional commits for commit messages

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Configure environment variables**
3. **Deploy automatically on push to main**

### Docker

\`\`\`bash
# Build the image
docker build -t secuview-platform .

# Run the container
docker run -p 3000:3000 secuview-platform
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@secuview.com
- 📖 Documentation: [docs.secuview.com](https://docs.secuview.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/secuview-platform/issues)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)

---

<div align="center">
  Made with ❤️ for enterprise security teams
</div>
