import { ProtectedRoute } from "@/components/route/protected-route";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Class Dashboard</div>
    </ProtectedRoute>
  )
}
