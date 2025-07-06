"use client";
import React, { useState, useEffect } from "react";
import DprCard from "../components/DprCard";
import BackButton from "../components/backbutton"
import axios from "axios";

export default function DprPage() {
  const [dprs, setDprs] = useState([]);

  async function makeDpr (){
    try{
      const res = axios.post('/api/dpr/crtdpr');
      if(res.status === 200){
        alert("DPR created successfully");
        // Optionally, you can refetch the DPRs after creating a new one
        fetchDprData();
      }
    }
    catch (error) {
      console.error("Error making DPR:", error);
    }
  }

  async function fetchDprData() {
    try {
      const response = await fetch("/api/dpr/getdprs");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Format date here before setting state
      const formattedDprs = data.map((dpr) => ({
        ...dpr,
        formattedDate: new Date(dpr.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));
      console.log("Formatted DPRs:", formattedDprs);

      setDprs(formattedDprs);
    } catch (error) {
      console.error("Error fetching DPR data:", error);
    }
  }

  useEffect(() => {
    fetchDprData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 text-center mb-8">
          Daily Production Reports
        </h1>

        {dprs.length === 0 ? (
          <p className="text-slate-500 text-center text-lg">No DPRs found.</p>
        ) : (
          <div className="grid gap-5">
            {dprs.map((dpr) => (
              <DprCard
                key={dpr.id}
                date={dpr.formattedDate}
                location={dpr.id}
              />
            ))}
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={makeDpr}
        >
          Make dpr
        </button>
        <BackButton />
      </div>
    </div>
  );
}
