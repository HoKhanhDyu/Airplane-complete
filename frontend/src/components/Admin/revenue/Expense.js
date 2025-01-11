import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

const Expense = () => {
  const doughnutChartRef = useRef(null);
  const doughnutChartInstance = useRef(null);
  const [economy, setEconomy] = useState(12000);
  const [business, setBusiness] = useState(40000);

  useEffect(() => {
    const currentYearData = localStorage.getItem("data");

    // Kiểm tra xem dữ liệu có tồn tại và có đúng định dạng không
    if (currentYearData) {
      const parsedData = JSON.parse(currentYearData);
      if (parsedData.economy && parsedData.business) {
        setEconomy(parsedData.economy);
        setBusiness(parsedData.business);
        
      } else {
        console.error("Invalid data format in localStorage");
      }
    } else {
      console.warn("Data not found in localStorage");
    }
  }, []); // Chạy một lần khi component mount

  useEffect(() => {
    if (economy && business && doughnutChartRef.current) {
      // Hủy biểu đồ cũ nếu tồn tại
      if (doughnutChartInstance.current) {
        doughnutChartInstance.current.destroy();
      }

      const ctx = doughnutChartRef.current.getContext("2d");
      doughnutChartInstance.current = new ChartJS(ctx, {
        type: "doughnut",
        data: {
          labels: ["Business", "Economy"],
          datasets: [
            {
              label: "Economy vs Business",
              data: [
                (economy / (economy + business) * 100).toFixed(2),
                (business / (economy + business) * 100).toFixed(2),
              ],
              backgroundColor: ["#4a90e2", "#50e3c2"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                },
              },
            },
            legend: {
              position: "top",
            },
          },
        },
      });
    }

    // Cleanup khi component bị unmount
    return () => {
      if (doughnutChartInstance.current) {
        doughnutChartInstance.current.destroy();
      }
    };
  }, [economy, business]); // Cập nhật lại biểu đồ mỗi khi economy hoặc business thay đổi

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-lg p-5 shadow-md text-center w-full h-[410px] flex flex-col items-center justify-center">
        <h3 className="text-lg mb-4">Economy/Business</h3>
        <div className="w-[50%]">
          <canvas ref={doughnutChartRef}></canvas>
        </div>
      </div>
      <div className="flex flex-col gap-12">
        <StatsBox title="Upgrade fee/month" value="$4,585" />
        <StatsBox title="Budget reserve/month" value="$50,400" />
      </div>
    </div>
  );
};

const StatsBox = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md text-center h-[180px] items-center justify-center flex flex-col">
      <h4 className="text-sm font-semibold text-gray-500">{title}</h4>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default Expense;
