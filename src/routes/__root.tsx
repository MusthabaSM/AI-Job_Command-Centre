import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Providers } from "@/components/shared/Providers"
import { Toaster } from "@/components/ui/sonner"
import { AppShell } from "@/components/layout/AppShell"

// We can mock AuthGuard logic at the router level later or wrap it here.
// In Next.js, middleware handled auth. We should let AuthGuard or beforeLoad handle it.

export const Route = createRootRoute({
  component: () => (
    <Providers attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AppShell>
        <Outlet />
      </AppShell>
      <Toaster position="top-right" richColors />
    </Providers>
  ),
})
