import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Mic, CheckCircle2 } from "lucide-react";
import bgImage from "@/assets/bg.jpg";

const KIAMBU_FACILITIES = [
  "Kiambu Level 5 Hospital",
  "Thika Level 5 Hospital",
  "Gatundu Level 4 Hospital",
  "Lari Sub-County Hospital",
  "Tigoni Sub-County Hospital",
  "Wangige Sub-County Hospital",
  "Ruiru Sub-County Hospital",
  "Githunguri Sub-County Hospital",
  "Karuri Level 4 Hospital",
  "Limuru Nursing Home",
  "Kihara Sub-County Hospital",
  "Kamiti Prison Hospital",
  "Ikinu Health Centre",
  "Kabete Health Centre",
  "Ndumberi Health Centre",
  "Kimende Health Centre",
  "Ngenda Health Centre",
  "Lusigetti Health Centre",
  "Kagwe Health Centre",
  "Juja Farm Health Centre",
];

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [facility, setFacility] = useState("");
  const [customFacility, setCustomFacility] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const isOther = facility === "__other__";
  const selectedFacility = isOther ? customFacility : facility;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedFacility) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      // Prepare form data for backend
      const ext = file.name.split(".").pop();
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("description", description);
      formData.append("facility", selectedFacility);

      // POST to FastAPI backend on Render
      const response = await fetch("https://voice-vault-6g37.onrender.com/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      setSuccess(true);
      setFile(null);
      setDescription("");
      setFacility("");
      setCustomFacility("");
      if (fileRef.current) fileRef.current.value = "";

      setTimeout(() => setSuccess(false), 3000);
      toast({ title: "Recording uploaded successfully!" });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
            <Mic className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Voice Upload</h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Upload facility voice recordings
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card/95 backdrop-blur-sm rounded-xl border border-border p-4 space-y-3 shadow-sm"
        >
          {/* File Upload */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">
              Audio File
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-3 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">
                {file ? file.name : "Tap to select MP3 or audio file"}
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the recording..."
              rows={2}
              className="resize-none text-sm min-h-[60px]"
            />
          </div>

          {/* Facility */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">
              Facility
            </label>
            <Select value={facility} onValueChange={setFacility}>
              <SelectTrigger>
                <SelectValue placeholder="Select facility" />
              </SelectTrigger>
              <SelectContent>
                {KIAMBU_FACILITIES.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
                <SelectItem value="__other__">Other</SelectItem>
              </SelectContent>
            </Select>
            {isOther && (
              <Input
                className="mt-2"
                placeholder="Enter facility name"
                value={customFacility}
                onChange={(e) => setCustomFacility(e.target.value)}
              />
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={uploading || !file || !selectedFacility}
          >
            {uploading ? (
              "Uploading..."
            ) : success ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Done!
              </span>
            ) : (
              "Upload Recording"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;
