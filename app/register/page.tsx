"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building2, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    storeName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const { storeName, ownerName, email, password, confirmPassword } = formData

    if (storeName.length < 3 || storeName.length > 50) {
      return "Nome da loja deve ter entre 3 e 50 caracteres"
    }

    if (ownerName.length < 3 || ownerName.length > 50) {
      return "Nome do responsável deve ter entre 3 e 50 caracteres"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Por favor, insira um email válido"
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)) {
      return "A senha deve ter pelo menos 8 caracteres, 1 maiúscula e 1 número"
    }

    if (password !== confirmPassword) {
      return "As senhas não coincidem"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      // TODO: Implement actual registration
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Move to success step
      setStep(2)
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Conta criada com sucesso!</CardTitle>
            <CardDescription>Enviamos um email de verificação para {formData.email}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Verifique sua caixa de entrada e clique no link para ativar sua conta.
            </p>
            <Button asChild className="w-full">
              <Link href="/subscription">Continuar para Assinatura</Link>
            </Button>
            <Link href="/login" className="text-sm text-accent hover:underline block">
              Voltar ao login
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-accent/10 rounded-full">
              <Building2 className="h-8 w-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Criar nova conta</CardTitle>
          <CardDescription>Passo 1 de 3 - Dados da sua loja</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="storeName">Nome da Loja *</Label>
              <Input
                id="storeName"
                placeholder="Ex: Andaimes São Paulo"
                value={formData.storeName}
                onChange={(e) => handleInputChange("storeName", e.target.value)}
                required
                disabled={isLoading}
                minLength={3}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName">Nome do Responsável *</Label>
              <Input
                id="ownerName"
                placeholder="Seu nome completo"
                value={formData.ownerName}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
                required
                disabled={isLoading}
                minLength={3}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                disabled={isLoading}
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Deve conter pelo menos 1 maiúscula, 1 minúscula e 1 número
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
                disabled={isLoading}
                minLength={8}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Faça login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
