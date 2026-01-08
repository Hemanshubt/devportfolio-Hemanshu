import { Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:gap-6 md:flex-row md:text-left">
          <div className="flex items-center gap-2 font-mono text-base font-bold text-primary sm:text-lg">
            <Terminal className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>devops.engineer</span>
          </div>

          <p className="font-mono text-xs text-muted-foreground sm:text-sm">
            <span className="text-secondary">$</span> echo "© {new Date().getFullYear()} All rights reserved"
          </p>

          <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground sm:text-sm">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
              System Status: Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
