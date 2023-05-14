import { SlCheck } from 'react-icons/sl';

export default function NoData({ message }: { message?: string }) {
  return (
    <div className="mt-10 text-center">
      <SlCheck className="mx-auto h-12 w-12 text-indigo-400" aria-hidden="true" />

      <h3 className="mt-5 text-sm font-semibold text-white">{message || 'No exceptions recorded'}</h3>
    </div>
  );
}
