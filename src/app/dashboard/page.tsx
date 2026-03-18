import { ProtectedRoute } from "@/components/common/protected-route";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Class Dashboard</div>
    </ProtectedRoute>
  )
}
