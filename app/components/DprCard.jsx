'use client';
import { useRouter } from 'next/navigation';

export default function DprCard(props) {
  const router = useRouter();

  return (
    <div className="bg-slate-50 border border-slate-300 p-6 rounded-xl shadow flex justify-between items-center hover:shadow-md transition duration-200">
      <div>
        <p className="text-xl font-semibold text-slate-800 mb-1">DPR Date:</p>
        <p className="text-lg text-slate-600">{props.date}</p>
      </div>
      <button
        onClick={() => router.push(`/dpr/${props.location}`)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        View Details
      </button>
    </div>
  );
}
