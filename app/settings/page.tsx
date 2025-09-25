"use client"

import type React from "react"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Building2, Shield, CreditCard, FileText, Save, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Store data
  const [storeData, setStoreData] = useState({
    storeName: "Andaimes São Paulo",
    ownerName: "João Silva",
    email: "joao@andaimessp.com",
    whatsapp: "(11) 99999-9999",
    slug: "andaimes-sao-paulo",
  })

  // Security data
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleStoreUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // TODO: Implement actual store update
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess("Dados da loja atualizados com sucesso!")
    } catch (err) {
      setError("Erro ao atualizar dados. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validate passwords
    if (securityData.newPassword.length < 8) {
      setError("A nova senha deve ter pelo menos 8 caracteres")
      setIsLoading(false)
      return
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    try {
      // TODO: Implement actual password update
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess("Senha alterada com sucesso!")
      setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      setError("Erro ao alterar senha. Verifique a senha atual.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard requireAuth requireSubscription>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground mt-2">Gerencie os dados da sua loja e configurações da conta</p>
          </div>

          {/* Success/Error Alerts */}
          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="store" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="store" className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Loja</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Segurança</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Pagamento</span>
              </TabsTrigger>
              <TabsTrigger value="form" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Formulário</span>
              </TabsTrigger>
            </TabsList>

            {/* Store Settings */}
            <TabsContent value="store">
              <Card>
                <CardHeader>
                  <CardTitle>Dados da Loja</CardTitle>
                  <CardDescription>
                    Atualize as informações da sua loja que aparecerão no formulário de orçamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStoreUpdate} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="storeName">Nome da Loja *</Label>
                        <Input
                          id="storeName"
                          value={storeData.storeName}
                          onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ownerName">Nome do Responsável *</Label>
                        <Input
                          id="ownerName"
                          value={storeData.ownerName}
                          onChange={(e) => setStoreData({ ...storeData, ownerName: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={storeData.email}
                          onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp *</Label>
                        <Input
                          id="whatsapp"
                          placeholder="(11) 99999-9999"
                          value={storeData.whatsapp}
                          onChange={(e) => setStoreData({ ...storeData, whatsapp: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                          Número para onde serão enviados os orçamentos via WhatsApp
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">URL do Formulário</Label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">https://andaimes-pro.com/budget/</span>
                        <Input
                          id="slug"
                          value={storeData.slug}
                          onChange={(e) => setStoreData({ ...storeData, slug: e.target.value })}
                          disabled={isLoading}
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        URL única da sua loja. Pode ser alterada apenas uma vez.
                      </p>
                    </div>

                    <Separator />

                    <Button type="submit" disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança da Conta</CardTitle>
                  <CardDescription>Altere sua senha para manter sua conta segura</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Senha Atual *</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={securityData.currentPassword}
                          onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova Senha *</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={securityData.newPassword}
                            onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                            required
                            disabled={isLoading}
                            minLength={8}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Mínimo 8 caracteres, 1 maiúscula e 1 número</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Nova Senha *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={securityData.confirmPassword}
                          onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                          required
                          disabled={isLoading}
                          minLength={8}
                        />
                      </div>
                    </div>

                    <Separator />

                    <Button type="submit" disabled={isLoading}>
                      <Shield className="h-4 w-4 mr-2" />
                      {isLoading ? "Alterando..." : "Alterar Senha"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Settings */}
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Pagamento</CardTitle>
                  <CardDescription>Gerencie seus métodos de pagamento e faturamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Método de Pagamento Atual</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <span>**** **** **** 1234</span>
                          <span className="text-sm text-muted-foreground">Visa</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Alterar
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Próxima Cobrança</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data:</span>
                          <span>25/11/2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Valor:</span>
                          <span className="font-semibold">R$ 99,90</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="text-green-600">Ativo</span>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Gerenciar Pagamentos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Form Settings */}
            <TabsContent value="form">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do Formulário</CardTitle>
                  <CardDescription>Personalize o formulário de orçamento da sua loja</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">URL do Formulário</h4>
                      <div className="flex items-center space-x-2">
                        <Input value="https://andaimes-pro.com/budget/andaimes-sao-paulo" readOnly className="flex-1" />
                        <Button variant="outline" size="sm">
                          Copiar
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">WhatsApp de Destino</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Número para onde os orçamentos serão enviados
                      </p>
                      <Input value="(11) 99999-9999" readOnly />
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Status do Formulário</h4>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Ativo - Recebendo orçamentos</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        O formulário fica inativo automaticamente se a assinatura expirar
                      </p>
                    </div>

                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Testar Formulário
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
