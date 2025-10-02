import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FileHeart, LogOut, Search } from "lucide-react";
import { toast } from "sonner";
import { DocumentList } from "@/components/DocumentList";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState("");
  const [patientData, setPatientData] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (!roles || roles.role !== "doctor") {
      toast.error("Access denied. Doctor role required.");
      navigate("/dashboard");
      return;
    }

    setLoading(false);
  };

  const handleSearch = async () => {
    if (!patientId.trim()) {
      toast.error("Please enter a patient ID");
      return;
    }

    setSearching(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("patient_id", patientId.trim().toUpperCase())
      .single();

    if (error || !data) {
      toast.error("Patient not found");
      setPatientData(null);
    } else {
      setPatientData(data);
      toast.success("Patient found");
    }
    setSearching(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileHeart className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Doctor Portal</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Search Patient</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Patient ID (e.g., PAT123456)"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={searching}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>

        {patientData && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Patient ID</p>
                <p className="font-medium">{patientData.patient_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{patientData.full_name}</p>
              </div>
              {patientData.date_of_birth && (
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{patientData.date_of_birth}</p>
                </div>
              )}
              {patientData.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{patientData.phone}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {patientData && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Medical Documents</h3>
            <DocumentList searchQuery="" patientUserId={patientData.id} />
          </div>
        )}
      </main>
    </div>
  );
}
