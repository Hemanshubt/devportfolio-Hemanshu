import { Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 font-mono text-lg font-bold text-primary">
            <Terminal className="h-5 w-5" />
            <span>devops.engineer</span>
          </div>

          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-secondary">$</span> echo "© {new Date().getFullYear()} All rights reserved"
          </p>

          <div className="flex items-center gap-4 font-mono text-sm text-muted-foreground">
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
