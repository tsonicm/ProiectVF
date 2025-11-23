import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminReviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin – Review tools</h1>
          <Button variant="outline" asChild>
            <a href="/">Back to public list</a>
          </Button>
        </header>

        <Button>
          Fetch new data from LLM
        </Button>

        <Card className="mt-4 p-4">
          <p className="text-sm text-muted-foreground">
            Aici va fi tabelul cu uneltele noi (pending), unde poți accepta sau respinge intrările.
          </p>
        </Card>
      </div>
    </div>
  )
}
