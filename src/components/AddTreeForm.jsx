"use client";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useId } from "react";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon, ImagePlusIcon, XIcon } from "lucide-react";
import CameraCapture from "@/components/CameraCapture";
export default function AddTreeDialog({ open, setOpen }) {
  const id = useId();
  const maxLength = 180;

  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({
    initialValue: "",
    maxLength,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="border-b px-6 py-4 text-base">
            Add a New Tree
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto">
          {/* You can include ProfileBg or Avatar here if needed */}
          
          <div className="px-6 pt-4 pb-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label>Tree Name</Label>
                <Input placeholder="Neem, Banyan, etc." required />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  maxLength={180}
                  onChange={handleChange}
                  placeholder="Details about the tree..."
                />
                <p className="text-right text-xs text-muted-foreground">
                  {limit - characterCount} characters left
                </p>
              </div>
              <div className="space-y-2">
  <Label>Tree Photo (Camera)</Label>

  <CameraCapture 
    onCapture={(img) => console.log("Captured Image:", img)}
  />
</div>
            </form>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
