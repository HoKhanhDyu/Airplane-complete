import React from "react";

const Card = () => {
    return (
      <div className="">
        <StatsBox title="Total revenue" value="$50.4K" />
      </div>
    );
  };
  
  const StatsBox = ({ title, value }) => {
    return (
      <div className="bg-white rounded-lg shadow-md w-full text-center flex gap-4 items-center p-4">
        <h3 className="text-lg">{title}</h3>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    );
  };
  
  export default Card;