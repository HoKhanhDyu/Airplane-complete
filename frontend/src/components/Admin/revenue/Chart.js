import React, { useState, useEffect, useRef } from "react";
import Card from './Card';
import {
  Chart as ChartJS,
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);


const Chart = () => {
  const [year, setYear] = useState(2024);
  const [dataByYear, setDataByYear] = useState([
    {
      year: 2021,
      revenue: [50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 160000],
      businessClass: [20000, 24000, 28000, 32000, 36000, 40000, 44000, 48000, 52000, 56000, 60000, 64000],
      economyClass: [30000, 36000, 42000, 48000, 54000, 60000, 66000, 72000, 78000, 84000, 90000, 96000],
    },
    {
      year: 2022,
      revenue: [55000, 65000, 75000, 85000, 95000, 105000, 115000, 125000, 135000, 145000, 155000, 165000],
      businessClass: [22000, 26000, 30000, 34000, 38000, 42000, 46000, 50000, 54000, 58000, 62000, 66000],
      economyClass: [33000, 39000, 45000, 51000, 57000, 63000, 69000, 75000, 81000, 87000, 93000, 99000],
    },
    {
      year: 2023,
      revenue: [60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000],
      businessClass: [24000, 28000, 32000, 36000, 40000, 44000, 48000, 52000, 56000, 60000, 64000, 68000],
      economyClass: [36000, 42000, 48000, 54000, 60000, 66000, 72000, 78000, 84000, 90000, 96000, 102000],
    },
    {
      year: 2024,
      revenue: [65000, 75000, 85000, 95000, 105000, 115000, 125000, 135000, 145000, 155000, 165000, 175000],
      businessClass: [26000, 30000, 34000, 38000, 42000, 46000, 50000, 54000, 58000, 62000, 66000, 70000],
      economyClass: [39000, 45000, 51000, 57000, 63000, 69000, 75000, 81000, 87000, 93000, 99000, 105000],
    },
  ]);
  
  
  const revenueChartRef = useRef(null);
  const barChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  // useEffect(() => {
  //   Fetch data from API
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("");
  //       const data = await response.json();
  //       setDataByYear(data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const currentYearData = dataByYear.find((item) => item.year === year);
    const economy = currentYearData.economyClass.reduce((acc, curr) => acc + curr, 0);
    const business = currentYearData.businessClass.reduce((acc, curr) => acc + curr, 0);
    localStorage.setItem("data", JSON.stringify({ economy, business }));
    localStorage.setItem("economy", currentYearData.economyClass);
    localStorage.setItem("business", currentYearData.businessClass);
    if (!currentYearData) return;
    // Revenue Chart
    if (revenueChartRef.current) {
      // Hủy biểu đồ cũ nếu tồn tại
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
              data: currentYearData.businessClass,
              borderColor: "#4a90e2",
              backgroundColor: "rgba(74, 144, 226, 0.2)",
              fill: true,
            },
            {
              label: "Economy",
              data: currentYearData.economyClass,
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

    // Bar Chart
    if (barChartRef.current) {
      // Hủy biểu đồ cũ nếu tồn tại
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }

      const ctx = barChartRef.current.getContext("2d");
      barChartInstance.current = new ChartJS(ctx, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Revenue",
              data: currentYearData.revenue,
              backgroundColor: "#4a90e2",
              borderColor: "#4a90e2",
              borderWidth: 1,
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
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    // Cleanup khi component bị unmount
    return () => {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
    };
  }, [year]);

return (
  <div className="p-6">
    <div className="flex justify-between items-center mb-2">
      <Card />
        {/* Dropdown chọn năm */}
      <div className="flex justify-end mb-6">
        <label htmlFor="yearSelect" className="mr-3 text-lg font-medium">
          Year:
        </label>
        <select
          id="yearSelect"
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {dataByYear.map((data) => {
            return (
              <option key={data.year} value={data.year}>
                {data.year}
              </option>
            );
          } )}
        </select>
      </div>
    </div>
    
      {/* Biểu đồ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartComponent title="Revenue chart by flight class" chartRef={revenueChartRef} />
        <ChartComponent title="Monthly Revenue Chart" chartRef={barChartRef} />
      </div>
    </div>
);


};

const ChartComponent = ({ title, chartRef }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">{title}</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default Chart;