import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PublicToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Verification Tools</h1>
          <Button asChild>
            <a href="/login">Admin login</a>
          </Button>
        </header>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Aici o să apară tabelul public cu toate uneltele verificate.
          </p>
        </Card>
      </div>
    </div>
  )
}
