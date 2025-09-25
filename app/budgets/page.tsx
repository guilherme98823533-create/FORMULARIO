"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Download, Eye, CheckCircle, Trash2, MoreHorizontal, Calendar, Mail, Phone } from "lucide-react"

export default function BudgetsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedBudget, setSelectedBudget] = useState<any>(null)

  // Mock data - replace with actual API call
  const budgets = [
    {
      id: 1,
      clientName: "João Silva",
      clientEmail: "joao@empresa.com",
      clientPhone: "(11) 99999-9999",
      scaffoldType: "1x1.50m",
      height: "4M",
      towers: 2,
      status: "pending",
      date: "2024-10-25",
      time: "14:30",
      items: [
        { name: "Painel metálico 1,00x1,50m", quantity: 8 },
        { name: "Piso metálico 0,37x1,50m", quantity: 8 },
        { name: "Diagonal metálica 2,12m", quantity: 4 },
        { name: 'Roda metálica c/ rolamento PU 4"x1', quantity: 8 },
        { name: "Sapata ajustável", quantity: 8 },
        { name: "Guarda-corpo s/ porta c/ rodapé 1,50m", quantity: 6 },
        { name: "Guarda-corpo c/ porta c/ rodapé 1,50m", quantity: 2 },
        { name: "Escada metálica 2,00m", quantity: 4 },
      ],
    },
    {
      id: 2,
      clientName: "Maria Santos",
      clientEmail: "maria@construtora.com",
      clientPhone: "(11) 88888-8888",
      scaffoldType: "1x2.00m",
      height: "3M",
      towers: 1,
      status: "responded",
      date: "2024-10-25",
      time: "11:15",
      items: [
        { name: "Painel metálico 1,00x2,00m", quantity: 6 },
        { name: "Piso metálico 0,37x2,00m", quantity: 5 },
        { name: "Diagonal metálica 2,82m", quantity: 2 },
        { name: 'Roda metálica c/ rolamento PU 4"x1', quantity: 4 },
        { name: "Sapata ajustável", quantity: 4 },
        { name: "Guarda-corpo s/ porta c/ rodapé 2,00m", quantity: 3 },
        { name: "Guarda-corpo c/ porta c/ rodapé 2,00m", quantity: 1 },
        { name: "Escada metálica 1,00m", quantity: 1 },
        { name: "Escada metálica 2,00m", quantity: 1 },
      ],
    },
    {
      id: 3,
      clientName: "Pedro Costa",
      clientEmail: "pedro@obras.com",
      clientPhone: "(11) 77777-7777",
      scaffoldType: "1x1m",
      height: "5M",
      towers: 3,
      status: "pending",
      date: "2024-10-24",
      time: "16:45",
      items: [
        { name: "Painel metálico 1,00x1,00m", quantity: 30 },
        { name: "Piso metálico 0,33x1,00m", quantity: 9 },
        { name: "Diagonal metálica 1,41m", quantity: 6 },
        { name: 'Roda metálica c/ rolamento PU 4"x1', quantity: 12 },
        { name: "Sapata ajustável", quantity: 12 },
        { name: "Guarda-corpo s/ porta c/ rodapé 1,00m", quantity: 9 },
        { name: "Guarda-corpo c/ porta 1,00m", quantity: 3 },
        { name: "Escada metálica 1,00m", quantity: 3 },
        { name: "Escada metálica 2,00m", quantity: 6 },
      ],
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

  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch =
      budget.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || budget.status === statusFilter

    // Simple date filter - in real app, implement proper date range filtering
    const matchesDate = dateFilter === "all" || budget.date.includes("2024-10-25")

    return matchesSearch && matchesStatus && matchesDate
  })

  const handleMarkAsResponded = (budgetId: number) => {
    // TODO: Implement actual status update
    console.log("Marking budget as responded:", budgetId)
  }

  const handleDeleteBudget = (budgetId: number) => {
    // TODO: Implement actual deletion (soft delete)
    console.log("Deleting budget:", budgetId)
  }

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    console.log("Exporting to CSV")
  }

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Exporting to PDF")
  }

  return (
    <AuthGuard requireAuth requireSubscription>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Orçamentos</h1>
              <p className="text-muted-foreground mt-2">Gerencie todas as solicitações de orçamento</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filtros</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nome ou email do cliente"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="responded">Respondido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Período</label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="today">Hoje</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budgets Table */}
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Orçamento ({filteredBudgets.length})</CardTitle>
              <CardDescription>Lista de todas as solicitações recebidas através do formulário</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Andaime</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBudgets.map((budget) => (
                      <TableRow key={budget.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{budget.clientName}</p>
                            <p className="text-sm text-muted-foreground">{budget.clientEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{budget.clientPhone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{budget.scaffoldType}</p>
                            <p className="text-sm text-muted-foreground">
                              {budget.height} - {budget.towers} torre{budget.towers > 1 ? "s" : ""}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm">{budget.date}</p>
                              <p className="text-xs text-muted-foreground">{budget.time}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(budget.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedBudget(budget)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Detalhes do Orçamento #{budget.id}</DialogTitle>
                                  <DialogDescription>
                                    Solicitação de {budget.clientName} em {budget.date}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedBudget && (
                                  <div className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                      <div>
                                        <h4 className="font-semibold mb-2">Dados do Cliente</h4>
                                        <div className="space-y-1 text-sm">
                                          <p>
                                            <strong>Nome:</strong> {selectedBudget.clientName}
                                          </p>
                                          <p>
                                            <strong>Email:</strong> {selectedBudget.clientEmail}
                                          </p>
                                          <p>
                                            <strong>Telefone:</strong> {selectedBudget.clientPhone}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold mb-2">Especificações</h4>
                                        <div className="space-y-1 text-sm">
                                          <p>
                                            <strong>Tipo:</strong> Andaime {selectedBudget.scaffoldType}
                                          </p>
                                          <p>
                                            <strong>Altura:</strong> {selectedBudget.height}
                                          </p>
                                          <p>
                                            <strong>Torres:</strong> {selectedBudget.towers}
                                          </p>
                                          <p>
                                            <strong>Status:</strong> {getStatusBadge(selectedBudget.status)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Itens Solicitados</h4>
                                      <div className="border rounded-lg">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Item</TableHead>
                                              <TableHead className="text-right">Quantidade</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {selectedBudget.items.map((item: any, index: number) => (
                                              <TableRow key={index}>
                                                <TableCell className="text-sm">{item.name}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                  {item.quantity}
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {budget.status === "pending" && (
                                  <DropdownMenuItem onClick={() => handleMarkAsResponded(budget.id)}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Marcar como Respondido
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Enviar Email
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteBudget(budget.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
