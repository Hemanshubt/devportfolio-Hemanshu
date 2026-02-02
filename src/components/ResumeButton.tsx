import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Terminal, CheckCircle } from 'lucide-react';

export default function ResumeButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  const terminalSequence = [
    '$ wget resume.pdf',
    'Connecting...',
    'HTTP request sent...',
    '200 OK',
    'Length: 245KB',
    'Saving to: Resume.pdf',
    '',
    '████████████ 100%',
    '',
    '✓ Complete!'
  ];

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    setDownloadComplete(false);
    setTerminalLines([]);

    // Animate terminal lines
    for (let i = 0; i < terminalSequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, i === 7 ? 600 : 150));
      setTerminalLines(prev => [...prev, terminalSequence[i]]);
    }

    // Trigger actual download
    await new Promise(resolve => setTimeout(resolve, 300));

    // Create download link
    const link = document.createElement('a');
    link.href = '/Hemanshu_Mahajan.pdf';
    link.download = 'Hemanshu_Mahajan.pdf';
    link.click();

    setDownloadComplete(true);

    // Reset after delay
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadComplete(false);
      setTerminalLines([]);
    }, 2000);
  };

  return (
    <>
      {/* Full-screen terminal overlay for both mobile and desktop */}
      <AnimatePresence>
        {isDownloading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mx-4 w-full max-w-xs sm:max-w-sm"
            >
              <div className="rounded-lg border border-border bg-background shadow-2xl shadow-primary/20">
                {/* Terminal header */}
                <div className="flex items-center gap-2 border-b border-border px-3 py-2 sm:px-4 sm:py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500 sm:h-3 sm:w-3" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 sm:h-3 sm:w-3" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 sm:h-3 sm:w-3" />
                  <span className="ml-2 font-mono text-[10px] text-muted-foreground sm:text-xs">download.sh</span>
                </div>

                {/* Terminal content */}
                <div className="p-3 font-mono text-[11px] text-left leading-relaxed sm:p-4 sm:text-sm sm:leading-loose">
                  {terminalLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`${line.startsWith('$') ? 'text-secondary' :
                          line.startsWith('✓') ? 'text-green-500' :
                            line.startsWith('█') ? 'text-primary' :
                              line.includes('200 OK') ? 'text-green-500' :
                                'text-muted-foreground'
                        }`}
                    >
                      {line || '\u00A0'}
                    </motion.div>
                  ))}
                  {!downloadComplete && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block h-3 w-1.5 bg-primary sm:h-4 sm:w-2"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleDownload}
        disabled={isDownloading}
        className="group relative flex items-center gap-2 overflow-hidden rounded-lg border border-primary/50 bg-primary/10 px-4 py-2.5 font-mono text-sm font-medium text-primary transition-all hover:bg-primary/20 disabled:cursor-wait sm:px-6 sm:py-3"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10 flex items-center gap-2">
          {downloadComplete ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Downloaded!</span>
            </>
          ) : isDownloading ? (
            <>
              <Terminal className="h-4 w-4 animate-pulse" />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              <span>Download CV</span>
            </>
          )}
        </span>

        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"
          initial={{ x: '-100%' }}
          animate={isDownloading ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 2, repeat: isDownloading ? Infinity : 0 }}
        />
      </motion.button>
    </>
  );
}
