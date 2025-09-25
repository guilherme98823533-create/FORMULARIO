"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Building2, LayoutDashboard, FileText, Settings, CreditCard, LogOut, User, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [subscriptionStatus] = useState("active") // active, expiring, expired

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Orçamentos",
      href: "/budgets",
      icon: FileText,
    },
    {
      name: "Assinatura",
      href: "/subscription",
      icon: CreditCard,
    },
    {
      name: "Configurações",
      href: "/settings",
      icon: Settings,
    },
  ]

  const getSubscriptionBadge = () => {
    switch (subscriptionStatus) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Ativo
          </Badge>
        )
      case "expiring":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            Expirando
          </Badge>
        )
      case "expired":
        return <Badge variant="destructive">Expirado</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const handleLogout = () => {
    // TODO: Implement actual logout
    localStorage.removeItem("auth_token")
    localStorage.removeItem("subscription_status")
    window.location.href = "/login"
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center space-x-2 px-4 py-2">
              <Building2 className="h-8 w-8 text-accent" />
              <div>
                <h2 className="font-bold text-lg">Andaimes Pro</h2>
                <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Assinatura</span>
                {getSubscriptionBadge()}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    <span className="truncate">Andaimes São Paulo</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/subscription">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Assinatura
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4 lg:px-6">
              <SidebarTrigger className="lg:hidden">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <div className="ml-auto flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Andaimes São Paulo
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Configurações</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
