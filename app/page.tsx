import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">AI Chat Interface</h1>
        <p className="text-lg md:text-xl text-slate-600">
          Interact with AI models using a simple and intuitive interface
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chat">
            <Button size="lg" className="gap-2">
              Start Chatting <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/settings">
            <Button size="lg" variant="outline">
              Configure API
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
