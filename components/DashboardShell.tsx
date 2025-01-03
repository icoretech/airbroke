// components/DashboardShell.tsx

import Search from '@/components/Search';
import { SidebarOpenButton } from '@/components/SidebarButtons';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import { SidebarProvider } from '@/components/SidebarProvider';
import { UserMenu } from '@/components/UserMenu';
import { auth } from '@/lib/auth';

export async function DashboardShell({
  initialSidebarOpen,
  selectedProjectId,
  searchDisabled = false,
  children,
}: {
  initialSidebarOpen: boolean;
  selectedProjectId?: string;
  searchDisabled?: boolean;
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <SidebarProvider initialSidebarOpen={initialSidebarOpen}>
      <div>
        <SidebarMobile>
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-airbroke-800 px-6 pb-2 ring-1 ring-white/5 scrollbar-none">
            <SidebarDesktop selectedProjectId={selectedProjectId} />
          </div>
        </SidebarMobile>

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-airbroke-800 px-6 ring-1 ring-white/5 scrollbar-none">
            <SidebarDesktop selectedProjectId={selectedProjectId} />
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/5 bg-airbroke-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <SidebarOpenButton />
            {/* Separator */}
            <div aria-hidden="true" className="h-6 w-px lg:hidden lg:bg-white/5" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <Search isDisabled={searchDisabled} />
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Separator */}
                <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/5" />
                {/* Profile dropdown */}
                <UserMenu email={user?.email ?? ''} username={user?.name ?? ''} />
              </div>
            </div>
          </div>
          <main className="pb-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
