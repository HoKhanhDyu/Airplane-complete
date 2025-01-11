import React from "react";

const Logo = () => {
  return (
    <header className="bg-blue-400 p-5 rounded-b-lg flex justify-between items-center shadow-md border-b border-blue-300 relative top-0 right-0 w-full z-10">
      <h2 className="text-white text-lg flex items-center">
        <i className="fas fa-plane mr-2 text-lg text-center"></i>
        <span className="underline">HỆ THỐNG QUẢN LÝ MUA VÉ MÁY BAY</span>
      </h2>
      <div className="flex items-center">
        <span className="text-white mr-3 text-base">Nguyễn A</span>
        <img
          src="https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-6/470673749_1101634084770939_9189704234038860895_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=4GWCRnS4GbwQ7kNvgE60MLi&_nc_zt=23&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=AfWdO2D54M4NE6exPGgFA6m&oh=00_AYDQcnZuqqy5hXC1tSWukxi3bMXAr8opdopqfUczcR3zTQ&oe=67784B32"
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-white"
        />
      </div>
    </header>
  );
};

export default Logo;