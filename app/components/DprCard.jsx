'use client';
import { useRouter } from 'next/navigation';

export default function DprCard(props) {
  const router = useRouter();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors duration-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 mb-1">DPR Date</p>
          <p className="text-lg font-medium text-gray-900">{props.date}</p>
        </div>
        <button
          onClick={() => router.push(`/dpr/${props.location}`)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}