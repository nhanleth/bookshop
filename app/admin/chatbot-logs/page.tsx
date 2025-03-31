"use client"

import { useState, useEffect } from "react"
import { getAllChatbotLogs, getAllUsers } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Search, Eye, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function AdminChatbotLogsPage() {
  const [logs, setLogs] = useState([])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLog, setSelectedLog] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const logsData = await getAllChatbotLogs()
        const usersData = await getAllUsers()
        setLogs(logsData)
        setUsers(usersData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Get user details for a log
  const getUserDetails = (userId) => {
    if (!userId) return null
    return users.find((user) => user.id === userId)
  }

  const handleDeleteLog = (logId) => {
    // In a real app, this would call an API endpoint
    setLogs(logs.filter((log) => log.id !== logId))
    toast.success("Chatbot log deleted successfully")
  }

  const filteredLogs = logs.filter(
    (log) =>
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.response.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chatbot Logs</h1>
          <p className="text-muted-foreground">Loading chatbot interaction logs...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chatbot Logs</h1>
        <p className="text-muted-foreground">View and analyze chatbot interactions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Message</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-t">
                  <td className="px-4 py-3 text-sm">#{log.id}</td>
                  <td className="px-4 py-3 text-sm">
                    {log.userId ? getUserDetails(log.userId)?.name || `User #${log.userId}` : "Anonymous"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="truncate max-w-[300px]">{log.message}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(log.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Chatbot Interaction</DialogTitle>
                            <DialogDescription>Detailed view of this chatbot conversation.</DialogDescription>
                          </DialogHeader>
                          {selectedLog && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Log ID</h4>
                                  <p>#{selectedLog.id}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">User</h4>
                                  <p>
                                    {selectedLog.userId
                                      ? getUserDetails(selectedLog.userId)?.name || `User #${selectedLog.userId}`
                                      : "Anonymous"}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                                  <p>{new Date(selectedLog.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">Time</h4>
                                  <p>{new Date(selectedLog.createdAt).toLocaleTimeString()}</p>
                                </div>
                              </div>

                              <div className="space-y-4 mt-4">
                                <div className="p-4 bg-muted rounded-lg">
                                  <h4 className="text-sm font-medium text-muted-foreground mb-2">User Message</h4>
                                  <p>{selectedLog.message}</p>
                                </div>
                                <div className="p-4 bg-primary/10 rounded-lg">
                                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Chatbot Response</h4>
                                  <div dangerouslySetInnerHTML={{ __html: selectedLog.response }} />
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this chatbot log.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteLog(log.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

