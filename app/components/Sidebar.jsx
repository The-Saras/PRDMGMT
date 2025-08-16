"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="bg-slate-800 text-white h-screen w-64 p-5 flex flex-col gap-4 border-r border-slate-700">
      <h1 className="text-xl font-semibold mb-8 tracking-wide">ESSCON PIPES AND FITTINGS</h1>

      <nav className="flex flex-col gap-2">
        <Link
          href="/dpr"
          className="px-3 py-2 rounded hover:bg-slate-700 transition"
        >
          DPR List
        </Link>

        <Link
          href="/rawmat"
          className="px-3 py-2 rounded hover:bg-slate-700 transition"
        >
          Add Raw Material
        </Link>

        <Link
          href="/stock"
          className="px-3 py-2 rounded hover:bg-slate-700 transition"
        >
          Stock Summary
        </Link>

        <Link
          href="/prod"
          className="px-3 py-2 rounded hover:bg-slate-700 transition"
        >
          Pipes List
        </Link>

        <Link
          href="/crtpipe"
          className="px-3 py-2 rounded hover:bg-slate-700 transition"
        >
          Create New Pipe
        </Link>
      </nav>
    </div>
  );
}
