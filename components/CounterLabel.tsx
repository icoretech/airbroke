// components/CounterLabel.tsx

import numbro from 'numbro';

export default function CounterLabel({ counter }: { counter: bigint }) {
  const getCounterColorClass = () => {
    const ranges = [1, 10, 20, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
    const colorClasses = [
      'ring-gray-700 bg-gravity-50',
      'ring-gray-700 bg-gravity-100',
      'ring-gray-700 bg-gravity-200',
      'ring-gray-700 bg-gravity-300',
      'ring-gray-700 bg-gravity-400',
      'ring-gray-700 bg-gravity-500',
      'ring-gray-700 bg-gravity-600',
      'ring-gray-700 bg-gravity-700',
      'ring-gray-700 bg-gravity-800',
      'ring-gray-700 bg-gravity-900',
      'ring-gray-700 bg-gravity-900', // Fallback for values > 10000
    ];

    for (let i = 0; i < ranges.length; i++) {
      if (counter <= ranges[i]) {
        return colorClasses[i];
      }
    }

    return colorClasses[colorClasses.length - 1]; // Fallback for values > 10000
  };

  return (
    <div
      className={`ml-auto w-10 min-w-max whitespace-nowrap rounded-full px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-white ring-1 ring-inset ${getCounterColorClass()}`}
    >
      {numbro(Number(counter)).format({
        average: true,
        mantissa: 1,
        totalLength: 1,
      })}
    </div>
  );
}
