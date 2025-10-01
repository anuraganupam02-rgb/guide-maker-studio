import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileHeart, Upload, Clock, Shield, Search } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-accent/30">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8 animate-fade-in">
              <FileHeart className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Your Medical Records,
              <br />
              <span className="text-primary">Organized & Accessible</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
              Stop struggling with folders full of prescriptions, bills, and reports. 
              MediFile helps you organize, search, and access your medical history effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Simplify Your Medical Records
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Easy Upload</h3>
              <p className="text-muted-foreground">
                Upload prescriptions, lab reports, bills, and scans. Organize by category and date.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Timeline View</h3>
              <p className="text-muted-foreground">
                See your complete medical history in chronological order. Track your health journey.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Smart Search</h3>
              <p className="text-muted-foreground">
                Find any document instantly by searching doctor names, hospitals, or document titles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Secure & Private
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Your medical records are encrypted and only accessible by you. 
              We take your privacy seriously.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
              Start Organizing Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
