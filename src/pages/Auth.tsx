import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileHeart } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <FileHeart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">MediFile</h1>
          <p className="text-muted-foreground">Your medical records, organized</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "hsl(355 65% 55%)",
                    brandAccent: "hsl(355 65% 45%)",
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
}
