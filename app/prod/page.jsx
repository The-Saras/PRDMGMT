"use client";
import { useEffect, useState } from "react";

export default function PipesPage() {
  const [pipes, setPipes] = useState([]);

  async function fetchPipes() {
    try {
      const res = await fetch(`/api/pipe/getall`);
      setPipes(await res.json());
    } catch (error) {
      console.error("Error fetching pipes:", error);
    }
  }

  useEffect(() => {
    fetchPipes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">Pipes Inventory</h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {pipes.map((pipe) => (
          <div
            key={pipe.id}
            className="border border-gray-200 bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-blue-800 mb-3">{pipe.name}</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Short Name:</span> {pipe.sname}
              </p>
              <p>
                <span className="font-medium">Quantity:</span> {pipe.Quantity}
              </p>
              <p>
                <span className="font-medium">Size:</span> {pipe.weight}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
