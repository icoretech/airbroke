export default function ToolCardWrapper({ occurrenceId }: { occurrenceId: bigint }) {
  return (
    <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
      <div className="flex flex-1 flex-col p-8">
        <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src="" alt="" />
        <h3 className="mt-6 text-sm font-medium text-gray-900">Ask the AI</h3>
        <dl className="mt-1 flex flex-grow flex-col justify-between">
          <dt className="sr-only">Title</dt>
          <dd className="text-sm text-gray-500">{occurrence.message}</dd>
          <dt className="sr-only">Role</dt>
          <dd className="mt-3">
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              OpenAI
            </span>
          </dd>
        </dl>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <a
              href={`mailto:${occurrence.message}`}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <BsRobot className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Start
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}
