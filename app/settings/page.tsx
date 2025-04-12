"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import { saveApiSettings } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

const formSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  model: z.string().min(1, "Model is required"),
})

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      model: "gpt-4o",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true)
      await saveApiSettings(data)
      toast.success("Settings saved successfully")
      router.push("/chat")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md p-4">
      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
          <CardDescription>Configure your AI API settings to start chatting</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input id="apiKey" type="password" placeholder="sk-..." {...form.register("apiKey")} />
              {form.formState.errors.apiKey && (
                <p className="text-sm text-red-500">{form.formState.errors.apiKey.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select defaultValue="gpt-4o" onValueChange={(value) => form.setValue("model", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
