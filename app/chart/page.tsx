"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { SendIcon, BotIcon, UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { sendMessage } from "@/lib/actions"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
})

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      const userMessage = { role: "user" as const, content: data.message }
      setMessages((prev) => [...prev, userMessage])
      form.reset()

      const response = await sendMessage(data.message)

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 flex flex-col h-[calc(100vh-80px)]">
      <h1 className="text-2xl font-bold mb-4">AI Chat</h1>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <BotIcon className="h-12 w-12 mb-2" />
            <p>Start a conversation with the AI</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <Card key={index} className={cn("w-full max-w-[85%]", message.role === "user" ? "ml-auto" : "mr-auto")}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {message.role === "user" ? (
                    <UserIcon className="h-5 w-5 mt-1 text-slate-600" />
                  ) : (
                    <BotIcon className="h-5 w-5 mt-1 text-slate-600" />
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        {isLoading && (
          <Card className="w-full max-w-[85%] mr-auto">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BotIcon className="h-5 w-5 text-slate-600" />
                <div className="animate-pulse">Thinking...</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 sticky bottom-0 bg-white p-2 border-t">
        <Input
          placeholder="Type your message..."
          {...form.register("message")}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  )
}
