"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Trash2, ExternalLink, Users, MessageSquare, TrendingUp } from "lucide-react"

interface Post {
  id: string
  title: string
  content: string
  link?: string
  author: string
  votes: number
  userVotes: { [userId: string]: "up" | "down" }
  createdAt: string
  type: "text" | "link"
}

interface User {
  id: string
  email: string
  username: string
  isAdmin: boolean
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and is admin
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (!parsedUser.isAdmin) {
      router.push("/")
      return
    }

    setUser(parsedUser)

    // Load posts and users
    const savedPosts = localStorage.getItem("posts")
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }

    const savedUsers = localStorage.getItem("users")
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }
  }, [router])

  const handleDeletePost = (postId: string) => {
    const updatedPosts = posts.filter((post) => post.id !== postId)
    setPosts(updatedPosts)
    localStorage.setItem("posts", JSON.stringify(updatedPosts))
    setMessage("Post deleted successfully")
    setTimeout(() => setMessage(""), 3000)
  }

  const getStats = () => {
    const totalUsers = users.filter((u) => !u.isAdmin).length
    const totalPosts = posts.length
    const totalVotes = posts.reduce((sum, post) => sum + Math.abs(post.votes), 0)

    return { totalUsers, totalPosts, totalVotes }
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Feed
            </Button>
            <h1 className="text-2xl font-bold text-red-600">Admin Dashboard</h1>
          </div>
          <Badge variant="destructive">Admin Panel</Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold">{stats.totalPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Votes</p>
                  <p className="text-2xl font-bold">{stats.totalVotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Management */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No posts to manage</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold truncate">{post.title}</h3>
                          <Badge variant={post.type === "link" ? "secondary" : "outline"}>{post.type}</Badge>
                          <Badge variant={post.votes >= 0 ? "default" : "destructive"}>{post.votes} votes</Badge>
                        </div>

                        {post.content && <p className="text-gray-700 text-sm mb-2 line-clamp-2">{post.content}</p>}

                        {post.link && (
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mb-2"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {post.link}
                          </a>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>by {post.author}</span>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="flex items-center gap-2 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            {users.filter((u) => !u.isAdmin).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No users registered yet</p>
            ) : (
              <div className="space-y-2">
                {users
                  .filter((u) => !u.isAdmin)
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <Badge variant="outline">User</Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
