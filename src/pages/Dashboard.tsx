import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileHeart, LogOut, Upload, Calendar, FileText, Search } from "lucide-react";
import { UploadDialog } from "@/components/UploadDialog";
import { DocumentList } from "@/components/DocumentList";
import { DocumentTimeline } from "@/components/DocumentTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/20">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileHeart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MediFile</h1>
              <p className="text-xs text-muted-foreground">Medical Records Organizer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setUploadOpen(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Document
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search documents by title, doctor, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list" className="gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Timeline
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            <DocumentList searchQuery={searchQuery} />
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-6">
            <DocumentTimeline searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </main>

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}
