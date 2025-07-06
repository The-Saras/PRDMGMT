"use client";
import { useState } from "react";
import BackButton from '../components/backbutton'
import axios from "axios";

export default function CreatePipe() {
  const [name, setName] = useState("");
  const [sname, setSname] = useState("");
  const [weight, setWeight] = useState(0);
  const [size, setSize] = useState("");
  const [type, setType] = useState("");

  async function createPipe() {
    try {
      const res = await axios.post("/api/pipe/create", {
        name: name,
        sname: sname,
        weight: Number(weight),
        size: size,
        type: type,
      });
      if (res.status === 200) {
        alert("Pipe created successfully!");
      }
      
    } catch (error) {
      console.error("Error creating pipe:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-6">
      <BackButton />
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Pipe</h1>
        <form className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter pipe name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Short Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. P1"
              onChange={(e) => setSname(e.target.value)}
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="float"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter weight"
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size (mm)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter size"
              onChange={(e) => setSize(e.target.value)}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
              onChange={(e) => setType(e.target.value)}
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="MS">MS</option>
              <option value="SS">SS</option>
              <option value="GI">GI</option>
              <option value="PVC">PVC</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="button"
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={createPipe}
            >
              Create Pipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
