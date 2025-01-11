import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PrintButton from "./PrintButton";

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Print = () => {
  const revenueChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  const [economy, setEconomy] = useState([]);
  const [business, setBusiness] = useState([]);

  useEffect(() => {
    try {
      let dataString = localStorage.getItem("economy");
      if (dataString) {
        let dataArray = dataString.split(",").map((value) => Number(value.trim()));
        setEconomy(dataArray);
      } else {
        console.warn("Economy data not found in localStorage");
      }

      dataString = localStorage.getItem("business");
      if (dataString) {
        let dataArray = dataString.split(",").map((value) => Number(value.trim()));
        setBusiness(dataArray);
      } else {
        console.warn("Business data not found in localStorage");
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  }, []);

  useEffect(() => {
    if (economy.length && business.length) {
      if (revenueChartRef.current) {
        if (revenueChartInstance.current) {
          revenueChartInstance.current.destroy();
        }

        const ctx = revenueChartRef.current.getContext("2d");
        revenueChartInstance.current = new ChartJS(ctx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
              {
                label: "Business",
                data: business,
                borderColor: "#4a90e2",
                backgroundColor: "rgba(74, 144, 226, 0.2)",
                fill: true,
              },
              {
                label: "Economy",
                data: economy,
                borderColor: "#50e3c2",
                backgroundColor: "rgba(80, 227, 194, 0.2)",
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
          },
        });
      }
    }
  }, [economy, business]);

  const exportToExcel = () => {
    if (!economy.length || !business.length) {
      console.warn("Economy or Business data is empty, cannot export to Excel.");
      return;
    }

    const rows = economy.map((eco, index) => [
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index],
      business[index],
      eco,
    ]);

    const headers = ["Month", "Business", "Economy"];
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Doanh thu");
    XLSX.writeFile(wb, "Revenue.xlsx");
  };

  return (
    <div className="mx-32 mt-4 flex flex-col gap-4">
      <PrintButton />
      <ChartComponent title="Revenue chart by flight class" chartRef={revenueChartRef} />
      <p className="flex justify-center mt-7">
        <button onClick={exportToExcel} className="px-4 py-2 bg-blue-500 text-white rounded text-2xl font-semibold hover:bg-blue-400 transition-all">
          Export Excel File
        </button>
      </p>
    </div>
  );
};

const ChartComponent = ({ title, chartRef }) => {
  return (
    <div className="bg-white rounded-lg p-5 shadow-md">
      <h3 className="text-lg mb-4">{title}</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default Print;
