'use client'; // if you're on app router (Next.js 13+)

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Back to Home
    </button>
  );
}
