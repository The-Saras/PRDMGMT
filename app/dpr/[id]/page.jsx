"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import DownloadDprButton from "../../components/DownloadDprButton";

export default function DprDet() {
  const [dprDetails, setDprDetails] = useState(null);
  const [name, setName] = useState("");
  const [qty, setQty] = useState(null);
  const [pipeName, setPipeName] = useState("");
  const [pipeQty, setPipeQty] = useState(null);
  const [balance, setBalance] = useState(null);
  const { id } = useParams();
  const [importedBalance, setImportedBalance] = useState(0);

  const rmtData = {
    dprId: id,
    sname: name,
    quantity_used: parseFloat(qty),
  };

  const pipeData = {
    dprId: id,
    pipeId: pipeName,
    quantity_produced: parseFloat(pipeQty),
  };

  //ALL THE FUNCTIONS

  async function increaseTotal() {
    try {
      const res = await axios.post(`/api/dpr/total/${id}`);
      if (res.status === 200) {
        alert("Total updated successfully" + totalQtyUsed);
      } else {
        alert("Failed to update total");
      }
    } catch (error) {
      console.error("Error increasing total:", error);
      alert("Failed to update total");
    }
  }

  async function importBalanceToQtyUsed() {
    try {
      const res = await axios.post(`/api/dpr/baltot/${id}`,{
        bal: Number(balance.qutity),
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      if(res.status === 200) {
        alert("Balance imported successfully");
      }
      
    } catch (error) {
      console.error("Error importing balance:", error);
      alert("Failed to import balance");
    }
  }

  async function fetchbalance() {
    try {
      const response = await fetch(`/api/getbal`);
      setBalance(await response.json());
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }

  async function addBalance(diff) {
    try {
      const res = await axios.post(
        `/api/balance`,
        { diff: diff },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating balance:", error);
      alert("Failed to update balance");
    }
  }

  async function addPipeTodpr(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/dpr/addpipe`, pipeData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        alert("Pipe added successfully");
      } else {
        alert("Failed to add pipe");
      }
    } catch (error) {
      console.error("Error adding pipe:", error);
    }
  }
  async function addRawmaterialTodpr(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/dpr/addrmt`, rmtData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        alert("Raw material added successfully");
      } else {
        alert("Failed to add raw material");
      }
    } catch (error) {
      console.error("Error adding raw material:", error);
    }
  }
  async function fetchDprDetails() {
    try {
      const response = await fetch(`/api/dpr/getdpr/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch DPR details");
      }
      const data = await response.json();
      setDprDetails(data);
    } catch (error) {
      console.error("Error fetching DPR details:", error);
    }
  }

  useEffect(() => {
    if (id) {
      fetchDprDetails();
      fetchbalance();
    }
  }, [id]);

  //TOTAL OF RAW MATERIALS USED
  const totalQtyUsed =
    dprDetails?.dpr.rawMaterials.reduce(
      (total, item) => total + Number(item.quantity_used),
      0
    ) || 0;

  //Total Of WEIGHT PRODUCED
  const totalWeightProduced =
    dprDetails?.Pipes.pipes.reduce(
      (total, item) =>
        total + Number(item.quantity_used) * Number(item.pipe.weight || 0),
      0
    ) || 0;

  const totalQtyUsedFinal = dprDetails?.dpr.Total || 0;  
  const difference = totalQtyUsedFinal - totalWeightProduced;
  console.log("Difference:", difference);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold border-b border-gray-300 pb-2 mb-6">
        Daily Production Report
      </h1>

      {/* DPR Info */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          DPR Information
        </h2>
        <div className="border border-gray-300 p-4 bg-white">
          <p>
            <span className="font-semibold">DPR ID:</span> {id}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {dprDetails?.dpr.date
              ? new Date(dprDetails.dpr.date).toLocaleString()
              : "Loading..."}
          </p>
          <p>
            <span className="font-semibold">Balance:</span>{" "}
            {balance?.qutity || "Loading..."}
          </p>
          <button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition px-2"
            onClick={importBalanceToQtyUsed}
          >
            Import Balance
          </button>

          <button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={increaseTotal}
          >
            Update Total in db
          </button>
        </div>
      </div>

      {/* Raw Materials */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          Raw Materials Used
        </h2>
        <table className="w-full border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                #
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                Material Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                Quantity Used
              </th>
            </tr>
          </thead>
          <tbody>
            {dprDetails?.dpr.rawMaterials.length > 0 ? (
              <>
                {dprDetails.dpr.rawMaterials.map((item, index) => (
                  <tr key={item.id} className="border-t border-gray-300">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.rawMaterial.name}</td>
                    <td className="px-4 py-2">{item.quantity_used}</td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="border-t border-gray-300 bg-gray-50">
                  <td
                    colSpan="2"
                    className="px-4 py-2 font-semibold text-right"
                  >
                    Total Quantity Used:
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {dprDetails.dpr.Total}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="3" className="text-gray-500 px-4 py-2 text-center">
                  No raw materials recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Raw Material Form */}
      <div className="border border-gray-300 p-4 bg-white rounded mb-8">
        <h3 className="text-lg font-semibold mb-3">Add Raw Material</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity Used
            </label>
            <input
              type="number"
              placeholder="Enter quantity"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              onChange={(e) => setQty(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={addRawmaterialTodpr}
            >
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Pipe Production */}
      <div>
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          Pipe Production
        </h2>
        <table className="w-full border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                #
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                Quantity Produced
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">
                Weight
              </th>
            </tr>
          </thead>
          <tbody>
            {dprDetails?.Pipes.pipes.length > 0 ? (
              <>
                {dprDetails.Pipes.pipes.map((pipe, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{pipe.pipe.name}</td>
                    <td className="px-4 py-2">{pipe.quantity_used}</td>
                    <td className="px-4 py-2">{pipe.pipe.weight}</td>
                  </tr>
                ))}

                {/* Total Weight Produced Row */}
                <tr className="border-t border-gray-300 bg-gray-50">
                  <td
                    colSpan="3"
                    className="px-4 py-2 font-semibold text-right"
                  >
                    Total Weight Produced:
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {dprDetails.Pipes.pipes
                      .reduce(
                        (total, item) =>
                          total +
                          Number(item.quantity_used) *
                            Number(item.pipe.weight || 0),
                        0
                      )
                      .toFixed(2)}{" "}
                    kg
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="4" className="text-gray-500 px-4 py-2 text-center">
                  No pipe production recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border border-gray-300 p-4 bg-white rounded mb-8">
        <h3 className="text-lg font-semibold mb-3">Add Pipe Material</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pipe Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              onChange={(e) => setPipeName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity Used
            </label>
            <input
              type="number"
              placeholder="Enter quantity"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              onChange={(e) => setPipeQty(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={addPipeTodpr}
            >
              Add
            </button>
          </div>
        </form>
        <p className="text-lg mt-4">
          <strong>Difference:</strong> {difference.toFixed(2)} kg
        </p>
      </div>
      <DownloadDprButton dprId={id} />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => addBalance(difference)}
      >
        Balance Update
      </button>
    </div>
  );
}
