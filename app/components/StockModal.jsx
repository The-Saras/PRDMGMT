"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Modal({ isOpen, onClose, material, onSubmit }) {
  const [quantity, setQuantity] = useState(material?.Quantity || 0);
  const [change, setChange] = useState([]);

  async function fetchChanges(sname) {
    try {
      const res = await axios.post("/api/rawmat/changet", { sname });
      setChange(res.data);
    } catch (err) {
      console.error("Error fetching changes", err);
    }
  }

  useEffect(() => {
    if (material?.short_name) {
      fetchChanges(material.short_name);
    }
  }, [material]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">
          Edit {material?.name}
        </h2>

        <label className="block mb-2 font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border border-gray-300 px-3 py-2 w-full mb-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={()=>{onClose(); setChange([])}}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(material.short_name, quantity)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>

        {change.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-slate-800">Change History</h3>
            <ul className="list-disc pl-5">
              {change.map((c, index) => (
                <li key={index} className="text-gray-600">
                  {c.quantity} units changed on{" "}
                  {new Date(c.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No changes recorded for this material.</p>
        )}
      </div>
    </div>
  );
}
