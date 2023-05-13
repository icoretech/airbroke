import { FaCircleNotch } from 'react-icons/fa';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <FaCircleNotch className="h-6 w-6 animate-spin text-gray-300" />
        <span className="mt-2 text-lg font-semibold text-gray-300">Loading App...</span>
      </div>
    </div>
  );
}
