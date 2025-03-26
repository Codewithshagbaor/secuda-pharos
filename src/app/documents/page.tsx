import DocumentsPage from "@/components/documents-page"
import ProtectedRoute from "@/components/ProtectedRoute";
export default function Documents() {
  return (
    <ProtectedRoute>
      <DocumentsPage />
    </ProtectedRoute>
  ) 
}

