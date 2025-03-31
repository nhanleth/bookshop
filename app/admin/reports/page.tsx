import { getAllOrders, getBooks } from "@/lib/data"
import ClientReportsPage from "./client-page"

export default async function AdminReportsPage() {
  const orders = await getAllOrders()
  const books = await getBooks()

  // Calculate monthly revenue
  const monthlyRevenue = [
    { month: "Jan", revenue: 1200 },
    { month: "Feb", revenue: 1800 },
    { month: "Mar", revenue: 2400 },
    { month: "Apr", revenue: 2100 },
    { month: "May", revenue: 2800 },
    { month: "Jun", revenue: 3200 },
  ]

  // Calculate top selling books
  const bookSales = books
    .map((book) => ({
      id: book.id,
      title: book.title,
      sales: Math.floor(Math.random() * 50) + 1, // Random sales for demo
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  // Calculate order status data for pie chart
  const orderStatusData = [
    { name: "Pending", value: orders.filter((order) => order.status === "pending").length },
    { name: "Processing", value: orders.filter((order) => order.status === "processing").length },
    { name: "Shipped", value: orders.filter((order) => order.status === "shipped").length },
    { name: "Delivered", value: orders.filter((order) => order.status === "delivered").length },
    { name: "Cancelled", value: orders.filter((order) => order.status === "cancelled").length },
  ].filter((item) => item.value > 0)

  // Payment methods data
  const paymentMethodsData = [
    { name: "Credit Card", value: 15 },
    { name: "PayPal", value: 8 },
    { name: "Bank Transfer", value: 3 },
  ]

  // Inventory status data
  const inventoryStatusData = [
    { name: "In Stock", value: books.filter((book) => book.stock > 10).length },
    { name: "Low Stock", value: books.filter((book) => book.stock > 0 && book.stock <= 10).length },
    { name: "Out of Stock", value: books.filter((book) => book.stock === 0).length },
  ]

  // Customer growth data
  const customerGrowthData = [
    { month: "Jan", users: 10 },
    { month: "Feb", users: 15 },
    { month: "Mar", users: 22 },
    { month: "Apr", users: 28 },
    { month: "May", users: 35 },
    { month: "Jun", users: 42 },
  ]

  return (
    <ClientReportsPage
      monthlyRevenue={monthlyRevenue}
      orderStatusData={orderStatusData}
      paymentMethodsData={paymentMethodsData}
      bookSales={bookSales}
      inventoryStatusData={inventoryStatusData}
      customerGrowthData={customerGrowthData}
    />
  )
}

