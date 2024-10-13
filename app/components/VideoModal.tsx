import { Dialog, DialogContent } from "@/components/ui/dialog"

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black">
        <div className="w-full h-full flex items-center justify-center">
          <video 
            src="/videos/tidy.mp4" 
            controls 
            autoPlay 
            className="max-w-full max-h-[80vh] w-auto h-auto"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  )
}
