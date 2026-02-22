import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl: string;
  title: string;
}

const getEmbedUrl = (url: string) => {
  if (!url) return "";
  try {
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      videoId = new URL(url).searchParams.get("v") || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
  } catch (error) {
    return url;
  }
  return url;
};

export function TrailerModal({
  isOpen,
  onClose,
  trailerUrl,
  title,
}: TrailerModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const embedUrl = getEmbedUrl(trailerUrl);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`Tráiler de ${title}`}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-5xl"
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cerrar tráiler"
            >
              <X className="h-8 w-8" />
            </button>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-border/50">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${title} - Tráiler`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground font-sans">
                  URL del tráiler no válida
                </div>
              )}
            </div>

            <p className="mt-4 text-center text-lg font-medium text-foreground font-sans drop-shadow-md">
              {title} - Tráiler Oficial
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
