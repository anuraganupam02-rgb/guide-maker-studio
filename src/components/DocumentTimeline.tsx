import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download } from "lucide-react";
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
}

interface DocumentTimelineProps {
  searchQuery: string;
}

export function DocumentTimeline({ searchQuery }: DocumentTimelineProps) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .order("document_date", { ascending: false });

        if (error) throw error;
        setDocuments(data || []);
      } catch (error: any) {
        toast({ title: "Error loading documents", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [toast]);

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
    return <div className="text-center py-8">Loading timeline...</div>;
  }

  if (filteredDocuments.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No documents in timeline</h3>
        <p className="text-muted-foreground">Upload documents to see your medical history</p>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-8">
        {filteredDocuments.map((doc, index) => (
          <div key={doc.id} className="relative pl-20">
            {/* Timeline dot */}
            <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-primary border-4 border-background" />

            <Card className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-primary mb-1">
                    {format(new Date(doc.document_date), "MMMM dd, yyyy")}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{doc.title}</h3>
                </div>
                <Badge variant="secondary">{doc.category}</Badge>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground mb-4">
                {doc.doctor_name && <div>Doctor: {doc.doctor_name}</div>}
                {doc.hospital_name && <div>Hospital: {doc.hospital_name}</div>}
                {doc.notes && <div className="mt-2 text-foreground">{doc.notes}</div>}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                    <Eye className="w-4 h-4 mr-1" />
                    View Document
                  </a>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={doc.file_url} download={doc.file_name}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
