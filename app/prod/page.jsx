"use client";
import { useEffect, useState } from "react";
import BackButton from "../components/backbutton";

export default function PipesPage() {
  const [pipes, setPipes] = useState([]);
  const [type, setType] = useState("");
  const [weight, setWeight] = useState("");

  // fetch all pipes
  async function fetchPipes() {
    try {
      const res = await fetch(`/api/pipe/getall`);
      const jsonData = await res.json();
      setPipes(jsonData || []); // safe fallback
    } catch (error) {
      console.error("Error fetching pipes:", error);
      setPipes([]); // safe fallback
    }
  }

  // fetch filtered pipes
  const fetchFilteredPipes = async () => {
    try {
      if (!type && !weight) {
        fetchPipes();
        return;
      }

      const weightValue = weight ? parseFloat(weight) : "";
      const res = await fetch(
        `http://localhost:3000/api/pipe/filter?type=${type}&weight=${weightValue}`
      );
      const jsonData = await res.json();

      console.log(jsonData);

      setPipes(jsonData || []); // safe fallback
    } catch (error) {
      console.error("Error fetching filtered pipes:", error);
      setPipes([]); // safe fallback
    }
  };

  useEffect(() => {
    fetchPipes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <BackButton />
      <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">
        Pipes Inventory
      </h1>

      {/* Search Inputs */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Type"
          className="border p-2 rounded w-40"
        />
        <input
          type="number"
          step="0.01"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight"
          className="border p-2 rounded w-40"
        />
        <button
          onClick={fetchFilteredPipes}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
        <button
          onClick={() => {
            setType("");
            setWeight("");
            fetchPipes();
          }}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-xl shadow-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Short Name</th>
              <th className="px-4 py-3 text-left">Quantity</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Weight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {pipes.map((pipe, index) => (
              <tr key={pipe.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {index + 1}
                </td>
                <td className="px-4 py-3">{pipe.name}</td>
                <td className="px-4 py-3">{pipe.sname}</td>
                <td className="px-4 py-3">{pipe.Quantity}</td>
                <td className="px-4 py-3">{pipe.type}</td>
                <td className="px-4 py-3">{pipe.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {pipes.length === 0 && (
          <p className="text-center text-gray-600 mt-6">No pipes available.</p>
        )}
      </div>
    </div>
  );
}
