import React, { memo, useCallback } from "react";
import Input from "../../common/Input/Input";
import "./SearchBar.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = memo(
  ({ value, onChange, placeholder = "Поиск по названию или артикулу..." }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );
    return (
      <div className="search-bar">
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input"
        />
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
