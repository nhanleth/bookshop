"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  RevenueChart,
  OrderStatusChart,
  PaymentMethodsChart,
  TopSellingBooksChart,
  InventoryStatusChart,
  CustomerGrowthChart,
} from "@/components/admin/charts"

export default function ClientReportsPage({
  monthlyRevenue,
  orderStatusData,
  paymentMethodsData,
  bookSales,
  inventoryStatusData,
  customerGrowthData,
}) {
  const [activeTab, setActiveTab] = useState("sales")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">View sales and performance reports</p>
      </div>

      <Tabs defaultValue="sales" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue trends over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart data={monthlyRevenue} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderStatusChart data={orderStatusData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethodsChart data={paymentMethodsData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Books</CardTitle>
            </CardHeader>
            <CardContent>
              <TopSellingBooksChart data={bookSales} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryStatusChart data={inventoryStatusData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerGrowthChart data={customerGrowthData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

