import { SlCheck } from 'react-icons/sl';

export default function NoData({ message }: { message?: string }) {
  return (
    <div className="mt-10 text-center">
      <SlCheck className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />

      <h3 className="mt-2 text-sm font-semibold text-white">No exceptions recorded</h3>
    </div>
  );
}
