import React, { useState } from "react";

export const MenuItem = ({ icon, text, link, hasDropdown, dropdownItems }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <li className="relative group">
      <a
        href={link}
        className="flex items-center p-3 text-sm rounded hover:bg-white hover:text-[#2d5167]"
        onClick={(e) => hasDropdown && e.preventDefault()}
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        {icon && <i className={`fa ${icon} mr-2`}></i>}
        <span>{text}</span>
      </a>
      {hasDropdown && isDropdownOpen && (
        <ul className="absolute left-full top-0 bg-[#1a394d] w-48 mt-[-10px] p-2 rounded shadow-lg">
          {dropdownItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.link}
                className="block p-2 text-sm rounded hover:bg-white hover:text-[#2d5167]"
              >
                <i className={`fa ${item.icon} mr-2`}></i>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
