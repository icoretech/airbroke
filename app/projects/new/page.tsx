// app/projects/new/page.tsx

import CreateProjectProposal from '@/components/CreateProjectProposal';
import { DashboardShell } from '@/components/DashboardShell';
import { cookies } from 'next/headers';

export async function generateMetadata() {
  return { title: 'New Project' };
}

// /projects/new
export default async function NewProject() {
  const cookieStore = await cookies();
  const initialSidebarOpen = cookieStore.get('sidebarOpen')?.value === 'true';

  return (
    <DashboardShell initialSidebarOpen={initialSidebarOpen} searchDisabled={true}>
      <CreateProjectProposal />
    </DashboardShell>
  );
}
