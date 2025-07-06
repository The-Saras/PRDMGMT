"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import DownloadDprButton from "../../components/DownloadDprButton";
import BackButton from "../../components/backbutton";

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
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Production Management</h1>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600">Daily Production Report</span>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* DPR Header */}
        <div className="bg-white border border-gray-200 rounded-none mb-6">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">DPR Details</h2>
              <div className="flex space-x-4">
                <button
                  onClick={importBalanceToQtyUsed}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Import Balance
                </button>
                <button
                  onClick={increaseTotal}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Update Total
                </button>
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">DPR ID</dt>
                <dd className="text-base font-semibold text-gray-900">{id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Report Date</dt>
                <dd className="text-base font-semibold text-gray-900">
                  {dprDetails?.dpr.date
                    ? new Date(dprDetails.dpr.date).toLocaleDateString()
                    : "Loading..."}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Current Balance</dt>
                <dd className="text-base font-semibold text-gray-900">
                  {balance?.qutity || "Loading..."} kg
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Status</dt>
                <dd><span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Active</span></dd>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Raw Materials Section */}
          <div className="bg-white border border-gray-200 rounded-none">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Raw Materials</h3>
            </div>
            <div className="p-0">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Quantity (kg)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {dprDetails?.dpr.rawMaterials.length > 0 ? (
                    <>
                      {dprDetails.dpr.rawMaterials.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.rawMaterial.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity_used}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 border-t-2 border-gray-200">
                        <td colSpan="2" className="px-6 py-4 text-sm font-medium text-gray-900">
                          Total Quantity Used
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {dprDetails.dpr.Total} kg
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                        No raw materials recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Add Raw Material Form */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Add Raw Material</h4>
              <form className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Material name"
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Quantity (kg)"
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setQty(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    onClick={addRawmaterialTodpr}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Pipe Production Section */}
          <div className="bg-white border border-gray-200 rounded-none">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Pipe Production</h3>
            </div>
            <div className="p-0">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Pipe Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Weight (kg)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {dprDetails?.Pipes.pipes.length > 0 ? (
                    <>
                      {dprDetails.Pipes.pipes.map((pipe, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pipe.pipe.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pipe.quantity_used}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pipe.pipe.weight}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 border-t-2 border-gray-200">
                        <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900">
                          Total Weight Produced
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {dprDetails.Pipes.pipes
                            .reduce(
                              (total, item) =>
                                total +
                                Number(item.quantity_used) *
                                  Number(item.pipe.weight || 0),
                              0
                            )
                            .toFixed(2)} kg
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No pipe production recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Add Pipe Form */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Add Pipe Production</h4>
              <form className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Pipe name"
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setPipeName(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setPipeQty(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    onClick={addPipeTodpr}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white border border-gray-200 rounded-none">
            <div className="px-6 py-4">
              <dt className="text-sm font-medium text-gray-500 mb-1">Material Difference</dt>
              <dd className="text-2xl font-bold text-gray-900">{difference.toFixed(2)} kg</dd>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-none">
            <div className="px-6 py-4">
              <dt className="text-sm font-medium text-gray-500 mb-1">Total Input</dt>
              <dd className="text-2xl font-bold text-gray-900">{totalQtyUsedFinal} kg</dd>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-none">
            <div className="px-6 py-4">
              <dt className="text-sm font-medium text-gray-500 mb-1">Total Output</dt>
              <dd className="text-2xl font-bold text-gray-900">{totalWeightProduced.toFixed(2)} kg</dd>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <DownloadDprButton dprId={id} />
          <button
            onClick={() => addBalance(difference)}
            className="px-6 py-2 bg-gray-800 text-white text-sm font-medium hover:bg-gray-900 transition-colors"
          >
            Update Balance
          </button>
          <BackButton />
        </div>
      </div>
    </div>
  );
}