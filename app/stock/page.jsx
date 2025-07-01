"use client";
import { useEffect, useState } from "react";
import Modal from "../components/StockModal"

export default function StockSummary() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function fetchStockData() {
    try {
      const res = await fetch(`/api/rawmat/stock`);
      const data = await res.json();
      setRawMaterials(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  }

  async function updateQuantity(sname, newQty) {
    try {
      const res = await fetch(`/api/rawmat/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  qty: newQty,sname, }),
      });
      if (!res.ok) throw new Error("Failed to update");

      await fetchStockData();
      setModalOpen(false);
    } catch (err) {
      console.error("Error updating:", err);
    }
  }

  useEffect(() => {
    fetchStockData();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-slate-800">Stock Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rawMaterials.map((rmt) => (
          <div
            key={rmt.id}
            onClick={() => {
              setSelectedMaterial(rmt);
              setModalOpen(true);
            }}
            className="cursor-pointer bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">{rmt.name}</h2>
              <span className="text-sm text-gray-500">({rmt.short_name || 'N/A'})</span>
            </div>
            <p className="text-gray-600">
              <strong>Quantity:</strong> {rmt.Quantity}
            </p>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        material={selectedMaterial}
        onSubmit={updateQuantity}
      />
    </div>
  );
}
