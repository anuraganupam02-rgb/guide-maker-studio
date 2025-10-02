import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Trash2, Download, Calendar, Building2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Document {
  id: string;
  title: string;
  category: string;
  document_date: string;
  file_url: string;
  file_name: string;
  doctor_name: string | null;
  hospital_name: string | null;
  notes: string | null;
  created_at: string;
}

interface DocumentListProps {
  searchQuery: string;
  patientUserId?: string;
}

export function DocumentList({ searchQuery, patientUserId }: DocumentListProps) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = patientUserId || session.user.id;

      const { data, error } = await supabase
        .from("documents")
        .select(`
          *,
          document_metadata (
            category,
            document_date,
            doctor_name,
            hospital_name,
            summary
          )
        `)
        .eq("user_id", userId)
        .order("upload_date", { ascending: false });

      if (error) throw error;

      const formattedData = (data || []).map((doc: any) => ({
        id: doc.id,
        title: doc.file_name,
        category: doc.document_metadata?.category || "General",
        document_date: doc.document_metadata?.document_date || doc.upload_date,
        file_url: doc.file_path,
        file_name: doc.file_name,
        doctor_name: doc.document_metadata?.doctor_name,
        hospital_name: doc.document_metadata?.hospital_name,
        notes: doc.document_metadata?.summary,
        created_at: doc.created_at
      }));

      setDocuments(formattedData);
    } catch (error: any) {
      toast({ title: "Error loading documents", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();

    const channel = supabase
      .channel("documents-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "documents" }, () => {
        fetchDocuments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientUserId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const { error } = await supabase.from("documents").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Document deleted successfully" });
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const query = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.category.toLowerCase().includes(query) ||
      doc.doctor_name?.toLowerCase().includes(query) ||
      doc.hospital_name?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <div className="text-center py-8">Loading documents...</div>;
  }

  if (filteredDocuments.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No documents found</h3>
        <p className="text-muted-foreground">
          {searchQuery ? "Try a different search term" : "Upload your first medical document to get started"}
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredDocuments.map((doc) => (
        <Card key={doc.id} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">{doc.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {doc.category}
              </Badge>
            </div>
            <FileText className="w-5 h-5 text-primary" />
          </div>

          <div className="space-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(doc.document_date), "MMM dd, yyyy")}
            </div>
            {doc.doctor_name && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {doc.doctor_name}
              </div>
            )}
            {doc.hospital_name && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {doc.hospital_name}
              </div>
            )}
          </div>

          {doc.notes && (
            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{doc.notes}</p>
          )}

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1" asChild>
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 mr-1" />
                View
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={doc.file_url} download={doc.file_name}>
                <Download className="w-4 h-4" />
              </a>
            </Button>
            {!patientUserId && (
              <Button size="sm" variant="outline" onClick={() => handleDelete(doc.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
