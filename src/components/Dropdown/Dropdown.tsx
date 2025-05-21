import React, { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.scss";

interface DropdownProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  label: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onSelect,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <label className={styles.label}>{label}</label>
      <div className={styles.selected} onClick={() => setIsOpen(!isOpen)}>
        {selected}
        <span className={`${styles.arrow} ${isOpen ? styles.open : ""}`}></span>
      </div>

      {isOpen && (
        <div className={styles.menu}>
          {options.map((option) => (
            <div
              key={option}
              className={`${styles.option} ${
                selected === option ? styles.selected : ""
              }`}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
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
