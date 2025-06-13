"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center px-6 py-2 rounded-full bg-[#1a2035] text-white border border-[#1a2035] focus:outline-none"
      >
        <span className="mr-2">{value}</span>
        <FaChevronDown className="text-xs" />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-[#1a2035] rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="px-6 py-2 cursor-pointer hover:bg-[#232a47] text-white rounded-lg"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
