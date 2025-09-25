"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Clock, CheckCircle, Calendar, Copy, ExternalLink, AlertTriangle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DashboardPage() {
  const [formUrl] = useState("https://andaimes-pro.com/budget/andaimes-sao-paulo")
  const [subscriptionStatus] = useState("active") // active, expiring, expired
  const [subscriptionExpiry] = useState("2024-11-25")

  const copyFormUrl = () => {
    navigator.clipboard.writeText(formUrl)
    // TODO: Add toast notification
  }

  const stats = [
    {
      title: "Total de Orçamentos",
      value: "127",
      icon: FileText,
      description: "Todos os tempos",
      trend: "+12% este mês",
    },
    {
      title: "Pendentes",
      value: "8",
      icon: Clock,
      description: "Aguardando resposta",
      trend: "3 novos hoje",
    },
    {
      title: "Respondidos",
      value: "119",
      icon: CheckCircle,
      description: "Taxa de resposta: 94%",
      trend: "+5 esta semana",
    },
    {
      title: "Hoje",
      value: "3",
      icon: Calendar,
      description: "Novos orçamentos",
      trend: "Média: 2.5/dia",
    },
  ]

  const recentBudgets = [
    {
      id: 1,
      clientName: "João Silva",
      email: "joao@empresa.com",
      scaffoldType: "1x1.50m",
      status: "pending",
      date: "2024-10-25",
      time: "14:30",
    },
    {
      id: 2,
      clientName: "Maria Santos",
      email: "maria@construtora.com",
      scaffoldType: "1x2.00m",
      status: "responded",
      date: "2024-10-25",
      time: "11:15",
    },
    {
      id: 3,
      clientName: "Pedro Costa",
      email: "pedro@obras.com",
      scaffoldType: "1x1m",
      status: "pending",
      date: "2024-10-24",
      time: "16:45",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>
      case "responded":
        return <Badge variant="default">Respondido</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const getSubscriptionAlert = () => {
    if (subscriptionStatus === "expired") {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Sua assinatura expirou. Renove agora para continuar recebendo orçamentos.{" "}
            <Link href="/subscription" className="underline font-medium">
              Renovar Assinatura
            </Link>
          </AlertDescription>
        </Alert>
      )
    }

    if (subscriptionStatus === "expiring") {
      const daysLeft = Math.ceil(
        (new Date(subscriptionExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      )
      return (
        <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            Sua assinatura vence em {daysLeft} dias ({subscriptionExpiry}).{" "}
            <Link href="/subscription" className="underline font-medium">
              Renovar Agora
            </Link>
          </AlertDescription>
        </Alert>
      )
    }

    return null
  }

  return (
    <AuthGuard requireAuth requireSubscription>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bem-vindo, Andaimes São Paulo!</h1>
            <p className="text-muted-foreground mt-2">Gerencie seus orçamentos de andaimes de forma eficiente</p>
          </div>

          {/* Subscription Alert */}
          {getSubscriptionAlert()}

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Form URL Card */}
          <Card>
            <CardHeader>
              <CardTitle>Link do Formulário de Orçamento</CardTitle>
              <CardDescription>
                Compartilhe este link com seus clientes para receber solicitações de orçamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm">{formUrl}</div>
                <Button variant="outline" size="sm" onClick={copyFormUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={formUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="mt-4">
                <Button asChild>
                  <a href={formUrl} target="_blank" rel="noopener noreferrer">
                    Testar Formulário
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Budgets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Orçamentos Recentes</CardTitle>
                <CardDescription>Últimas solicitações recebidas</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/budgets">Ver Todos</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBudgets.map((budget) => (
                  <div key={budget.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{budget.clientName}</p>
                          <p className="text-sm text-muted-foreground">{budget.email}</p>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">Andaime {budget.scaffoldType}</p>
                          <p className="text-muted-foreground">
                            {budget.date} às {budget.time}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">{getStatusBadge(budget.status)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
