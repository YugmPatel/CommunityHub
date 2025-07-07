"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, ExternalLink, LogOut, Plus, Shield } from "lucide-react"
import { PostDialog } from "@/components/post-dialog"

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

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [showPostDialog, setShowPostDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load posts from localStorage
    const savedPosts = localStorage.getItem("posts")
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }
  }, [router])

  const handleVote = (postId: string, voteType: "up" | "down") => {
    if (!user) return

    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((post) => {
        if (post.id === postId) {
          const currentVote = post.userVotes[user.id]
          let newVotes = post.votes
          const newUserVotes = { ...post.userVotes }

          // Remove previous vote if exists
          if (currentVote === "up") newVotes -= 1
          if (currentVote === "down") newVotes += 1

          // Add new vote if different from current
          if (currentVote !== voteType) {
            if (voteType === "up") newVotes += 1
            if (voteType === "down") newVotes -= 1
            newUserVotes[user.id] = voteType
          } else {
            // Remove vote if clicking same button
            delete newUserVotes[user.id]
          }

          return {
            ...post,
            votes: newVotes,
            userVotes: newUserVotes,
          }
        }
        return post
      })

      localStorage.setItem("posts", JSON.stringify(updatedPosts))
      return updatedPosts
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  const handleCreatePost = (postData: { title: string; content: string; link?: string; type: "text" | "link" }) => {
    if (!user) return

    const newPost: Post = {
      id: Date.now().toString(),
      title: postData.title,
      content: postData.content,
      link: postData.link,
      author: user.username,
      votes: 0,
      userVotes: {},
      createdAt: new Date().toISOString(),
      type: postData.type,
    }

    const updatedPosts = [newPost, ...posts]
    setPosts(updatedPosts)
    localStorage.setItem("posts", JSON.stringify(updatedPosts))
    setShowPostDialog(false)
  }

  // Sort posts by votes (highest first)
  const sortedPosts = [...posts].sort((a, b) => b.votes - a.votes)

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-orange-600">CommunityHub</h1>
            {user.isAdmin && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Admin
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.username}</span>
            {user.isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin")}
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Create Post Button */}
        <div className="mb-6">
          <Button onClick={() => setShowPostDialog(true)} className="w-full sm:w-auto flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Post
          </Button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {sortedPosts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No posts yet. Be the first to create one!
              </CardContent>
            </Card>
          ) : (
            sortedPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Voting */}
                    <div className="flex flex-col items-center gap-1 min-w-[40px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(post.id, "up")}
                        className={`p-1 h-8 w-8 ${
                          post.userVotes[user.id] === "up"
                            ? "text-orange-600 bg-orange-50"
                            : "text-gray-400 hover:text-orange-600"
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <span
                        className={`text-sm font-medium ${
                          post.votes > 0 ? "text-orange-600" : post.votes < 0 ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        {post.votes}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(post.id, "down")}
                        className={`p-1 h-8 w-8 ${
                          post.userVotes[user.id] === "down"
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-400 hover:text-blue-600"
                        }`}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
                        <Badge variant={post.type === "link" ? "secondary" : "outline"}>
                          {post.type === "link" ? "Link" : "Text"}
                        </Badge>
                      </div>

                      {post.content && <p className="text-gray-700 mb-3 break-words">{post.content}</p>}

                      {post.link && (
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm mb-3"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {post.link}
                        </a>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>by {post.author}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Post Dialog */}
      <PostDialog open={showPostDialog} onOpenChange={setShowPostDialog} onSubmit={handleCreatePost} />
    </div>
  )
}
