import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileUp } from "lucide-react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  "Prescription",
  "Lab Report",
  "X-Ray/Scan",
  "Hospital Bill",
  "Pharmacy Bill",
  "Discharge Summary",
  "Medical Certificate",
  "Other",
];

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    document_date: "",
    doctor_name: "",
    hospital_name: "",
    notes: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "Please select a file", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from("medical-documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("medical-documents")
        .getPublicUrl(fileName);

      // Insert document record
      const { error: dbError } = await supabase.from("documents").insert({
        user_id: user.id,
        title: formData.title,
        category: formData.category,
        document_date: formData.document_date,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        doctor_name: formData.doctor_name || null,
        hospital_name: formData.hospital_name || null,
        notes: formData.notes || null,
      });

      if (dbError) throw dbError;

      toast({ title: "Document uploaded successfully!" });
      onOpenChange(false);
      setFile(null);
      setFormData({
        title: "",
        category: "",
        document_date: "",
        doctor_name: "",
        hospital_name: "",
        notes: "",
      });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Medical Document
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="file">Document File *</Label>
            <div className="mt-2 flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                required
              />
              {file && <FileUp className="w-5 h-5 text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Supported formats: PDF, Images, Word documents
            </p>
          </div>

          <div>
            <Label htmlFor="title">Document Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Blood Test Results"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="document_date">Document Date *</Label>
            <Input
              id="document_date"
              type="date"
              value={formData.document_date}
              onChange={(e) => setFormData({ ...formData, document_date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="doctor_name">Doctor Name</Label>
            <Input
              id="doctor_name"
              value={formData.doctor_name}
              onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
              placeholder="Dr. Smith"
            />
          </div>

          <div>
            <Label htmlFor="hospital_name">Hospital/Clinic Name</Label>
            <Input
              id="hospital_name"
              value={formData.hospital_name}
              onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
              placeholder="City Hospital"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional information..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={uploading} className="flex-1">
              {uploading ? "Uploading..." : "Upload Document"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
