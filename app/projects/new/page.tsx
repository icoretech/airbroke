import Form from './Form';

export default async function NewProject({ searchParams }: { searchParams: Record<string, string> }) {
  return (
    <>
      <main>
        <div className="mt-5 border-b border-white/5 px-4 pb-5 shadow-sm sm:px-6 lg:px-8">
          <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
            <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-white">Airbroke</h3>
            <p className="ml-2 mt-1 truncate text-sm text-gray-200">Project Creation</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <Form />
          </div>
        </div>
      </main>
    </>
  );
}
