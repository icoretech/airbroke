import { occurrence } from '@prisma/client';

export default function Params({ occurrence }: { occurrence: occurrence }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1>{JSON.stringify(occurrence.params)}</h1>
    </div>
  );
}
