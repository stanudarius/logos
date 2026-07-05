import { useState, useCallback, RefObject } from 'react';
import { toPng } from 'html-to-image';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import type { FeedCard } from "@/src/features/feed/types";

export const useCardExport = (card: FeedCard, containerRef: RefObject<HTMLDivElement | null>) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportImage = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      setIsExporting(true);
      await new Promise(r => setTimeout(r, 100));
      
      const rect = containerRef.current.getBoundingClientRect();
      
      const exportOptions = {
        quality: 1.0, 
        pixelRatio: 3, // Dropped to 3x to avoid Safari sub-pixel tracking bugs at 4x
        width: rect.width,     // Lock exact width to prevent flex-wrap reflows
        height: rect.height,   // Lock exact height
        backgroundColor: '#FAF8F3',
        cacheBust: true, // helps with web fonts
        style: { transform: 'scale(1)', transformOrigin: 'top left' }, // Prevent scaling artifacts
        filter: (node: any) => {
          if (node instanceof HTMLElement) {
            if (node.classList.contains('action-bar-exclude')) return false;
          }
          return true;
        }
      };

      // Safari hack: first pass often fails to embed Google Fonts. We render once and discard.
      try { await toPng(containerRef.current, exportOptions); } catch (e) {}
      
      // Second pass has a much higher success rate with fonts on iOS
      const dataUrl = await toPng(containerRef.current, exportOptions);
      
      const fileName = `logos-card-${card.philosopher?.replace(/\s+/g, '-').toLowerCase() || 'export'}.png`;

      if (Capacitor.isNativePlatform()) {
        const { uri } = await Filesystem.writeFile({
          path: fileName,
          data: dataUrl.split(',')[1],
          directory: Directory.Cache,
        });
        await Share.share({
          title: 'Logos Card',
          url: uri,
          dialogTitle: 'Share this card',
        });
      } else {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Logos Card'
            });
            return; // Web share succeeded
          }
        } catch (e) {
          console.warn("Web Share API failed, falling back to download", e);
        }
        
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporting(false);
    }
  }, [card.philosopher, containerRef]);

  return { isExporting, handleExportImage };
};
