"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, Loader2, AlertTriangle } from "lucide-react"

interface ScaffoldItem {
  name: string
  id: string
}

interface ScaffoldData {
  [key: string]: {
    [category: string]: ScaffoldItem[]
  }
}

interface HeightPresets {
  [scaffoldType: string]: {
    heights: string[]
    presets: {
      [height: string]: {
        [itemId: string]: number
      }
    }
  }
}

export default function ScaffoldFormPage() {
  const params = useParams()
  const slug = params.slug as string

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [storeActive, setStoreActive] = useState(true)
  const [storeName, setStoreName] = useState("Andaimes São Paulo")

  // Form state
  const [clientData, setClientData] = useState({
    name: "",
    phone: "",
    email: "",
  })

  const [selectedScaffoldType, setSelectedScaffoldType] = useState("1x1")
  const [selectedHeight, setSelectedHeight] = useState("2M")
  const [towerQuantity, setTowerQuantity] = useState(1)
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({})

  // Scaffold data from the original JavaScript
  const scaffoldData: ScaffoldData = {
    "1x1": {
      Painéis: [{ name: "Painel metálico 1,00x1,00m", id: "painel-1x1" }],
      Pisos: [{ name: "Piso metálico 0,33x1,00m", id: "piso-1x1" }],
      Diagonais: [{ name: "Diagonal metálica 1,41m", id: "diagonal-1x1" }],
      Rodas: [{ name: 'Roda metálica c/ rolamento PU 4"x1', id: "roda-1x1" }],
      "Sapatas ajustáveis": [{ name: "Sapata ajustável", id: "sapata-1x1" }],
      "Guarda-corpo": [
        { name: "Guarda-corpo c/ porta 1,00m", id: "guarda-corpo-porta-1x1" },
        { name: "Guarda-corpo s/ porta c/ rodapé 1,00m", id: "guarda-corpo-sem-porta-1x1" },
      ],
      Escadas: [
        { name: "Escada metálica 1,00m", id: "escada-1m-1x1" },
        { name: "Escada metálica 2,00m", id: "escada-2m-1x1" },
      ],
    },
    "1x1.50": {
      Painéis: [{ name: "Painel metálico 1,00x1,50m", id: "painel-1x150" }],
      Pisos: [{ name: "Piso metálico 0,37x1,50m", id: "piso-1x150" }],
      Diagonais: [{ name: "Diagonal metálica 2,12m", id: "diagonal-1x150" }],
      Rodas: [{ name: 'Roda metálica c/ rolamento PU 4"x1', id: "roda-1x150" }],
      "Sapatas ajustáveis": [{ name: "Sapata ajustável", id: "sapata-1x150" }],
      "Guarda-corpo": [
        { name: "Guarda-corpo s/ porta c/ rodapé 1,50m", id: "guarda-corpo-sem-porta-1x150" },
        { name: "Guarda-corpo c/ porta c/ rodapé 1,50m", id: "guarda-corpo-porta-1x150" },
      ],
      Escadas: [
        { name: "Escada metálica 1,00m", id: "escada-1m-1x150" },
        { name: "Escada metálica 2,00m", id: "escada-2m-1x150" },
      ],
    },
    "1x2.00": {
      Painéis: [{ name: "Painel metálico 1,00x2,00m", id: "painel-1x200" }],
      Pisos: [{ name: "Piso metálico 0,37x2,00m", id: "piso-1x200" }],
      Diagonais: [{ name: "Diagonal metálica 2,82m", id: "diagonal-1x200" }],
      Rodas: [{ name: 'Roda metálica c/ rolamento PU 4"x1', id: "roda-1x200" }],
      "Sapatas ajustáveis": [{ name: "Sapata ajustável", id: "sapata-1x200" }],
      "Guarda-corpo": [
        { name: "Guarda-corpo s/ porta c/ rodapé 2,00m", id: "guarda-corpo-sem-porta-1x200" },
        { name: "Guarda-corpo c/ porta c/ rodapé 2,00m", id: "guarda-corpo-porta-1x200" },
      ],
      Escadas: [
        { name: "Escada metálica 1,00m", id: "escada-1m-1x200" },
        { name: "Escada metálica 2,00m", id: "escada-2m-1x200" },
      ],
    },
  }

  // Height presets from the original JavaScript
  const heightPresets: HeightPresets = {
    "1x1": {
      heights: ["2M", "3M", "4M", "5M"],
      presets: {
        "2M": {
          "painel-1x1": 4,
          "piso-1x1": 3,
          "diagonal-1x1": 1,
          "roda-1x1": 4,
          "sapata-1x1": 4,
          "guarda-corpo-porta-1x1": 1,
          "guarda-corpo-sem-porta-1x1": 3,
          "escada-1m-1x1": 0,
          "escada-2m-1x1": 1,
        },
        "3M": {
          "painel-1x1": 6,
          "piso-1x1": 3,
          "diagonal-1x1": 2,
          "roda-1x1": 4,
          "sapata-1x1": 4,
          "guarda-corpo-porta-1x1": 1,
          "guarda-corpo-sem-porta-1x1": 3,
          "escada-1m-1x1": 1,
          "escada-2m-1x1": 1,
        },
        "4M": {
          "painel-1x1": 8,
          "piso-1x1": 3,
          "diagonal-1x1": 2,
          "roda-1x1": 4,
          "sapata-1x1": 4,
          "guarda-corpo-porta-1x1": 1,
          "guarda-corpo-sem-porta-1x1": 3,
          "escada-1m-1x1": 0,
          "escada-2m-1x1": 2,
        },
        "5M": {
          "painel-1x1": 10,
          "piso-1x1": 3,
          "diagonal-1x1": 2,
          "roda-1x1": 4,
          "sapata-1x1": 4,
          "guarda-corpo-porta-1x1": 1,
          "guarda-corpo-sem-porta-1x1": 3,
          "escada-1m-1x1": 1,
          "escada-2m-1x1": 2,
        },
      },
    },
    "1x1.50": {
      heights: ["2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "10M"],
      presets: {
        "2M": {
          "painel-1x150": 4,
          "piso-1x150": 4,
          "diagonal-1x150": 2,
          "roda-1x150": 4,
          "sapata-1x150": 4,
          "guarda-corpo-sem-porta-1x150": 3,
          "guarda-corpo-porta-1x150": 1,
          "escada-1m-1x150": 0,
          "escada-2m-1x150": 1,
        },
        "3M": {
          "painel-1x150": 6,
          "piso-1x150": 4,
          "diagonal-1x150": 2,
          "roda-1x150": 4,
          "sapata-1x150": 4,
          "guarda-corpo-sem-porta-1x150": 3,
          "guarda-corpo-porta-1x150": 1,
          "escada-1m-1x150": 1,
          "escada-2m-1x150": 1,
        },
        "4M": {
          "painel-1x150": 8,
          "piso-1x150": 4,
          "diagonal-1x150": 2,
          "roda-1x150": 4,
          "sapata-1x150": 4,
          "guarda-corpo-sem-porta-1x150": 3,
          "guarda-corpo-porta-1x150": 1,
          "escada-1m-1x150": 0,
          "escada-2m-1x150": 2,
        },
        "5M": {
          "painel-1x150": 10,
          "piso-1x150": 4,
          "diagonal-1x150": 2,
          "roda-1x150": 4,
          "sapata-1x150": 4,
          "guarda-corpo-sem-porta-1x150": 3,
          "guarda-corpo-porta-1x150": 1,
          "escada-1m-1x150": 1,
          "escada-2m-1x150": 2,
        },
        "6M": {
          "painel-1x150": 12,
          "piso-1x150": 4,
          "diagonal-1x150": 3,
          "roda-1x150": 4,
          "sapata-1x150": 4,
          "guarda-corpo-sem-porta-1x150": 3,
          "guarda-corpo-porta-1x150": 1,
          "escada-1m-1x150": 0,
          "escada-2m-1x150": 3,
        },
        "7M": {
          "painel-1x150": 14,
          "piso-1x150": 4,
          "diagonal-1x150": 3,
          "roda-1x150": 4,
          "sapata-1x150": 4,
          "guarda-corpo-sem-porta-1x150": 3,
          "guarda-corpo-porta-1x150": 1,
          "escada-1m-1x150": 1,
          "escada-2m-1x150": 3,
        },
        "8M": {
          "painel-1x150": 16,
          "piso-1x150": 4,
          "diagonal-1x150": 4,
          "roda-1x150": 4,
          "sapata-1x150": 4,
          "guarda-corpo-sem-porta-1x150": 3,
          "guarda-corpo-porta-1x150": 1,
          "escada-1m-1x150": 0,
          "escada-2m-1x150": 4,
        },
        "9M": {
          "painel-1x150": 18,
          "piso-1x150": 4,
          "diagonal-1x150": 4,
          "roda-1x150": 4,
          "sapata-1x150": 4,
          "guarda-corpo-sem-porta-1x150": 3,
          "guarda-corpo-porta-1x150": 1,
          "escada-1m-1x150": 1,
          "escada-2m-1x150": 4,
        },
        "10M": {
          "painel-1x150": 20,
          "piso-1x150": 4,
          "diagonal-1x150": 4,
          "roda-1x150": 4,
          "sapata-1x150": 4,
          "guarda-corpo-sem-porta-1x150": 3,
          "guarda-corpo-porta-1x150": 1,
          "escada-1m-1x150": 0,
          "escada-2m-1x150": 5,
        },
      },
    },
    "1x2.00": {
      heights: ["2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "10M"],
      presets: {
        "2M": {
          "painel-1x200": 4,
          "piso-1x200": 5,
          "diagonal-1x200": 2,
          "roda-1x200": 4,
          "sapata-1x200": 4,
          "guarda-corpo-sem-porta-1x200": 3,
          "guarda-corpo-porta-1x200": 1,
          "escada-1m-1x200": 0,
          "escada-2m-1x200": 1,
        },
        "3M": {
          "painel-1x200": 6,
          "piso-1x200": 5,
          "diagonal-1x200": 2,
          "roda-1x200": 4,
          "sapata-1x200": 4,
          "guarda-corpo-sem-porta-1x200": 3,
          "guarda-corpo-porta-1x200": 1,
          "escada-1m-1x200": 1,
          "escada-2m-1x200": 1,
        },
        "4M": {
          "painel-1x200": 8,
          "piso-1x200": 5,
          "diagonal-1x200": 2,
          "roda-1x200": 4,
          "sapata-1x200": 4,
          "guarda-corpo-sem-porta-1x200": 3,
          "guarda-corpo-porta-1x200": 1,
          "escada-1m-1x200": 0,
          "escada-2m-1x200": 2,
        },
        "5M": {
          "painel-1x200": 10,
          "piso-1x200": 5,
          "diagonal-1x200": 2,
          "roda-1x200": 4,
          "sapata-1x200": 4,
          "guarda-corpo-sem-porta-1x200": 3,
          "guarda-corpo-porta-1x200": 1,
          "escada-1m-1x200": 1,
          "escada-2m-1x200": 2,
        },
        "6M": {
          "painel-1x200": 12,
          "piso-1x200": 5,
          "diagonal-1x200": 3,
          "roda-1x200": 4,
          "sapata-1x200": 4,
          "guarda-corpo-sem-porta-1x200": 3,
          "guarda-corpo-porta-1x200": 1,
          "escada-1m-1x200": 0,
          "escada-2m-1x200": 3,
        },
        "7M": {
          "painel-1x200": 14,
          "piso-1x200": 5,
          "diagonal-1x200": 3,
          "roda-1x200": 4,
          "sapata-1x200": 4,
          "guarda-corpo-sem-porta-1x200": 3,
          "guarda-corpo-porta-1x200": 1,
          "escada-1m-1x200": 1,
          "escada-2m-1x200": 3,
        },
        "8M": {
          "painel-1x200": 16,
          "piso-1x200": 5,
          "diagonal-1x200": 4,
          "roda-1x200": 4,
          "sapata-1x200": 4,
          "guarda-corpo-sem-porta-1x200": 3,
          "guarda-corpo-porta-1x200": 1,
          "escada-1m-1x200": 0,
          "escada-2m-1x200": 4,
        },
        "9M": {
          "painel-1x200": 18,
          "piso-1x200": 5,
          "diagonal-1x200": 4,
          "roda-1x200": 4,
          "sapata-1x200": 4,
          "guarda-corpo-sem-porta-1x200": 3,
          "guarda-corpo-porta-1x200": 1,
          "escada-1m-1x200": 1,
          "escada-2m-1x200": 4,
        },
        "10M": {
          "painel-1x200": 20,
          "piso-1x200": 5,
          "diagonal-1x200": 4,
          "roda-1x200": 4,
          "sapata-1x200": 4,
          "guarda-corpo-sem-porta-1x200": 3,
          "guarda-corpo-porta-1x200": 1,
          "escada-1m-1x200": 0,
          "escada-2m-1x200": 5,
        },
      },
    },
  }

  // Check if store is active on mount
  useEffect(() => {
    const checkStoreStatus = async () => {
      try {
        // TODO: Implement actual store status check
        // For now, simulate checking if store exists and subscription is active
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Simulate store lookup by slug
        if (slug === "andaimes-sao-paulo") {
          setStoreActive(true)
          setStoreName("Andaimes São Paulo")
        } else {
          setStoreActive(false)
        }
      } catch (err) {
        setStoreActive(false)
      }
    }

    checkStoreStatus()
  }, [slug])

  // Apply height preset when scaffold type or height changes
  useEffect(() => {
    applyHeightPreset()
  }, [selectedScaffoldType, selectedHeight, towerQuantity])

  const applyHeightPreset = () => {
    const preset = heightPresets[selectedScaffoldType]?.presets[selectedHeight]
    if (preset) {
      const newSelectedItems: { [key: string]: number } = {}
      Object.entries(preset).forEach(([itemId, quantity]) => {
        newSelectedItems[itemId] = quantity * towerQuantity
      })
      setSelectedItems(newSelectedItems)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate form
    if (!clientData.name || !clientData.phone || !clientData.email) {
      setError("Por favor, preencha todos os dados do cliente")
      setIsLoading(false)
      return
    }

    const hasSelectedItems = Object.values(selectedItems).some((qty) => qty > 0)
    if (!hasSelectedItems) {
      setError("Por favor, selecione pelo menos um item")
      setIsLoading(false)
      return
    }

    try {
      // Build WhatsApp message
      let message = `*SOLICITAÇÃO DE ORÇAMENTO - ANDAIMES TUBULARES*\n\n`
      message += `*Cliente:* ${clientData.name.toUpperCase()}\n`
      message += `*Telefone:* ${clientData.phone}\n`
      message += `*Email:* ${clientData.email}\n\n`
      message += `*Tipo de Andaime:* Andaime Tubular ${selectedScaffoldType.replace("x", "x")}\n`
      message += `*Altura:* ${selectedHeight}\n`
      message += `*Torres:* ${towerQuantity}\n\n`

      // Add selected items by category
      const currentItems = scaffoldData[selectedScaffoldType]
      for (const [category, items] of Object.entries(currentItems)) {
        let categoryHasItems = false
        let categoryMessage = `*${category}*\n`

        items.forEach((item) => {
          const quantity = selectedItems[item.id]
          if (quantity && quantity > 0) {
            categoryMessage += `• ${item.name} → Quantidade: ${quantity}\n`
            categoryHasItems = true
          }
        })

        if (categoryHasItems) {
          message += categoryMessage + "\n"
        }
      }

      message += `Aguardo retorno com o orçamento. Obrigado!`

      // TODO: Save to database first, then send WhatsApp
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Open WhatsApp
      const encodedMessage = encodeURIComponent(message)
      const whatsappURL = `https://api.whatsapp.com/send/?phone=5541997630212&text=${encodedMessage}&type=phone_number&app_absent=0`
      window.open(whatsappURL, "_blank")

      // Reset form
      setClientData({ name: "", phone: "", email: "" })
      setSelectedItems({})
    } catch (err) {
      setError("Erro ao enviar orçamento. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!storeActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Loja Indisponível</CardTitle>
            <CardDescription>Esta loja não está ativa ou não foi encontrada</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              A loja pode estar com a assinatura vencida ou o link pode estar incorreto.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-accent/10 rounded-full">
                <Building2 className="h-8 w-8 text-accent" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
              Solicitação de Orçamento de Andaime Tubular
            </CardTitle>
            <CardDescription className="text-lg">{storeName}</CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Client Data */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nome Completo *</Label>
                  <Input
                    id="clientName"
                    placeholder="Digite seu nome completo"
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Telefone *</Label>
                  <Input
                    id="clientPhone"
                    placeholder="(41) 99999-9999"
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="seu@email.com"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scaffold Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Selecione o tipo de Andaime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {Object.keys(scaffoldData).map((type) => (
                  <div key={type} className="relative">
                    <input
                      type="radio"
                      id={`scaffold-${type}`}
                      name="scaffoldType"
                      value={type}
                      checked={selectedScaffoldType === type}
                      onChange={(e) => setSelectedScaffoldType(e.target.value)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`scaffold-${type}`}
                      className={`block p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedScaffoldType === type
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">Andaime Tubular</div>
                        <div className="text-xl font-bold">{type.replace("x", "x")}m</div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Height and Tower Selection */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Altura</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedHeight} onValueChange={setSelectedHeight}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {heightPresets[selectedScaffoldType]?.heights.map((height) => (
                      <SelectItem key={height} value={height}>
                        {height}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quantidade de Torres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTowerQuantity(Math.max(1, towerQuantity - 1))}
                    disabled={towerQuantity <= 1}
                  >
                    -
                  </Button>
                  <span className="text-2xl font-bold w-12 text-center">{towerQuantity}</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => setTowerQuantity(towerQuantity + 1)}>
                    +
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scaffold Items */}
          <Card>
            <CardHeader>
              <CardTitle>Andaime Tubular {selectedScaffoldType.replace("x", "x")}m</CardTitle>
              <CardDescription>
                Itens calculados automaticamente para {selectedHeight} com {towerQuantity} torre
                {towerQuantity > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(scaffoldData[selectedScaffoldType]).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-lg mb-3 text-accent">{category}</h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={item.id}
                              checked={selectedItems[item.id] > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const preset = heightPresets[selectedScaffoldType]?.presets[selectedHeight]
                                  const defaultQty = preset?.[item.id] || 1
                                  setSelectedItems({
                                    ...selectedItems,
                                    [item.id]: defaultQty * towerQuantity,
                                  })
                                } else {
                                  setSelectedItems({ ...selectedItems, [item.id]: 0 })
                                }
                              }}
                            />
                            <label htmlFor={item.id} className="font-medium cursor-pointer">
                              {item.name}
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              min="0"
                              value={selectedItems[item.id] || 0}
                              onChange={(e) =>
                                setSelectedItems({
                                  ...selectedItems,
                                  [item.id]: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-20 text-center"
                              disabled={!selectedItems[item.id] || selectedItems[item.id] === 0}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando Orçamento...
                  </>
                ) : (
                  "Solicitar Orçamento via WhatsApp"
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
