// components/CreateProjectProposal.tsx

import CreateForm from '@/components/project/CreateForm';

export default function CreateProjectProposal() {
  return (
    <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      <div className="mx-auto max-w-3xl">
        <CreateForm />
      </div>
    </div>
  );
}
