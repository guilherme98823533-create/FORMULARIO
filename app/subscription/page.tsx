"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PaymentForm } from "@/components/payment-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, CreditCard, Calendar, Download, AlertTriangle, Crown, Check } from "lucide-react"

export default function SubscriptionPage() {
  const [subscriptionStatus] = useState("active") // active, expiring, expired, inactive
  const [subscriptionExpiry] = useState("2024-11-25")
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const paymentHistory = [
    {
      id: 1,
      date: "2024-10-25",
      description: "Assinatura Mensal - Plano Profissional",
      amount: "R$ 99,90",
      status: "paid",
      receiptUrl: "#",
    },
    {
      id: 2,
      date: "2024-09-25",
      description: "Assinatura Mensal - Plano Profissional",
      amount: "R$ 99,90",
      status: "paid",
      receiptUrl: "#",
    },
    {
      id: 3,
      date: "2024-08-25",
      description: "Assinatura Mensal - Plano Profissional",
      amount: "R$ 99,90",
      status: "paid",
      receiptUrl: "#",
    },
  ]

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    setShowPaymentForm(false)
    // TODO: Update subscription status in backend
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
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
      case "inactive":
        return <Badge variant="outline">Inativo</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-500">
            Pago
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>
      case "failed":
        return <Badge variant="destructive">Falhou</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const getSubscriptionAlert = () => {
    if (subscriptionStatus === "expired") {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Sua assinatura expirou. Renove agora para continuar usando o sistema.</AlertDescription>
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
            Sua assinatura vence em {daysLeft} dias. Renove agora para evitar interrupções.
          </AlertDescription>
        </Alert>
      )
    }

    if (subscriptionStatus === "inactive") {
      return (
        <Alert className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-950">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Ative sua assinatura para começar a receber orçamentos através do formulário personalizado.
          </AlertDescription>
        </Alert>
      )
    }

    return null
  }

  if (paymentSuccess) {
    return (
      <AuthGuard requireAuth>
        <DashboardLayout>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">Pagamento Realizado com Sucesso!</CardTitle>
                <CardDescription>Sua assinatura foi ativada e você já pode começar a usar o sistema</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Próximos Passos:</h4>
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Configure os dados da sua loja nas configurações</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Compartilhe o link do formulário com seus clientes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Comece a receber orçamentos automaticamente</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button asChild className="flex-1">
                    <a href="/dashboard">Ir para Dashboard</a>
                  </Button>
                  <Button variant="outline" asChild className="flex-1 bg-transparent">
                    <a href="/settings">Configurações</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (showPaymentForm || subscriptionStatus === "inactive") {
    return (
      <AuthGuard requireAuth>
        <DashboardLayout>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Plan Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      <span>Plano Profissional</span>
                    </CardTitle>
                    <CardDescription>Sistema completo de gestão de orçamentos de andaimes</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">R$ 99,90</div>
                    <div className="text-sm text-muted-foreground">por mês</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Recursos Inclusos</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Orçamentos ilimitados</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Formulário personalizado</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Integração WhatsApp</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Relatórios e exportação</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Benefícios</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Suporte técnico</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Atualizações automáticas</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Backup dos dados</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>SSL e segurança</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <PaymentForm onSuccess={handlePaymentSuccess} onError={handlePaymentError} />

            <div className="text-center">
              <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
                Voltar
              </Button>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireAuth>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assinatura</h1>
            <p className="text-muted-foreground mt-2">Gerencie sua assinatura e histórico de pagamentos</p>
          </div>

          {/* Subscription Alert */}
          {getSubscriptionAlert()}

          {/* Current Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <span>Plano Profissional</span>
                  </CardTitle>
                  <CardDescription>Sistema completo de gestão de orçamentos de andaimes</CardDescription>
                </div>
                {getStatusBadge(subscriptionStatus)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Detalhes da Assinatura</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor Mensal:</span>
                      <span className="font-medium">R$ 99,90</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Próximo Vencimento:</span>
                      <span className="font-medium">{subscriptionExpiry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Renovação:</span>
                      <span className="font-medium">Automática</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recursos Inclusos</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Orçamentos ilimitados</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Formulário personalizado</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Integração WhatsApp</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Relatórios e exportação</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <Button onClick={() => setShowPaymentForm(true)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Renovar Assinatura
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Alterar Forma de Pagamento
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>Visualize todos os seus pagamentos e baixe recibos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-muted-foreground">{payment.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{payment.amount}</p>
                          {getPaymentStatusBadge(payment.status)}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Recibo
                      </Button>
                    </div>
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
