import { SiteLogo } from "./site-logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <SiteLogo />
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} LMS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
