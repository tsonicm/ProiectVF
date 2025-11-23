import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">Admin login</h1>

        <div className="space-y-2">
          <label className="text-sm" htmlFor="username">Username</label>
          <Input id="username" placeholder="admin" />
        </div>

        <div className="space-y-2">
          <label className="text-sm" htmlFor="password">Password</label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>

        <Button className="w-full mt-4">Login</Button>
      </Card>
    </div>
  )
}
