import { useState, useEffect, useRef, useCallback } from "react";

export function useDominantColor(
  imageUrl: string,
  defaultColor = "oklch(0.25 0.05 250)",
) {
  const [dominantColor, setDominantColor] = useState(defaultColor);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const extractColor = useCallback(() => {
    if (!imageUrl) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);

      const imageData = ctx.getImageData(0, 0, 50, 50).data;
      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      for (let i = 0; i < imageData.length; i += 16) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
        count++;
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      setDominantColor(`rgb(${r}, ${g}, ${b})`);
    };
  }, [imageUrl]);

  useEffect(() => {
    extractColor();
  }, [extractColor]);

  return { dominantColor, canvasRef };
}
