"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock, AlertTriangle, Loader2 } from "lucide-react"

interface PaymentFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PaymentForm({ onSuccess, onError }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardName: "",
    cpf: "",
    email: "",
    phone: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, "")
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatPhone = (value: string) => {
    const v = value.replace(/\D/g, "")
    return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  const validateForm = () => {
    const { cardNumber, expiryMonth, expiryYear, cvv, cardName, cpf, email, phone } = paymentData

    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
      return "Número do cartão inválido"
    }

    if (!expiryMonth || !expiryYear) {
      return "Data de validade inválida"
    }

    if (!cvv || cvv.length < 3) {
      return "CVV inválido"
    }

    if (!cardName || cardName.length < 3) {
      return "Nome no cartão é obrigatório"
    }

    if (!cpf || cpf.replace(/\D/g, "").length !== 11) {
      return "CPF inválido"
    }

    if (!email || !email.includes("@")) {
      return "Email inválido"
    }

    if (!phone || phone.replace(/\D/g, "").length < 10) {
      return "Telefone inválido"
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
      // TODO: Implement actual payment processing with Stripe or similar
      // This would typically involve:
      // 1. Create payment intent on backend
      // 2. Confirm payment with card details
      // 3. Handle 3D Secure if required
      // 4. Update subscription status

      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate payment success
      onSuccess?.()
    } catch (err) {
      const errorMessage = "Erro ao processar pagamento. Verifique os dados e tente novamente."
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)
  const months = [
    { value: "01", label: "01 - Janeiro" },
    { value: "02", label: "02 - Fevereiro" },
    { value: "03", label: "03 - Março" },
    { value: "04", label: "04 - Abril" },
    { value: "05", label: "05 - Maio" },
    { value: "06", label: "06 - Junho" },
    { value: "07", label: "07 - Julho" },
    { value: "08", label: "08 - Agosto" },
    { value: "09", label: "09 - Setembro" },
    { value: "10", label: "10 - Outubro" },
    { value: "11", label: "11 - Novembro" },
    { value: "12", label: "12 - Dezembro" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Dados do Pagamento</span>
        </CardTitle>
        <CardDescription>Preencha os dados do seu cartão de crédito para ativar a assinatura</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Card Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número do Cartão *</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                maxLength={19}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Mês *</Label>
                <Select
                  value={paymentData.expiryMonth}
                  onValueChange={(value) => handleInputChange("expiryMonth", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryYear">Ano *</Label>
                <Select
                  value={paymentData.expiryYear}
                  onValueChange={(value) => handleInputChange("expiryYear", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                  maxLength={4}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Nome no Cartão *</Label>
              <Input
                id="cardName"
                placeholder="Nome como está no cartão"
                value={paymentData.cardName}
                onChange={(e) => handleInputChange("cardName", e.target.value.toUpperCase())}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Separator />

          {/* Billing Information */}
          <div className="space-y-4">
            <h4 className="font-semibold">Dados de Cobrança</h4>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={paymentData.cpf}
                  onChange={(e) => handleInputChange("cpf", formatCPF(e.target.value))}
                  maxLength={14}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={paymentData.phone}
                  onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
                  maxLength={15}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={paymentData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Separator />

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Seus dados estão protegidos com criptografia SSL</span>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processando Pagamento...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Pagar R$ 99,90/mês
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
