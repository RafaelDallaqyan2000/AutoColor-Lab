import React, { useState } from "react";
import Input from "../../common/Input/Input";
import Button from "../../common/Button/Button";
import { validateVIN } from "../../../utils/vinValidator";
import "./VINInput.css";

interface VINInputProps {
  onVINSubmit: (vin: string) => void;
  isLoading?: boolean;
}

const VINInput: React.FC<VINInputProps> = ({
  onVINSubmit,
  isLoading = false,
}) => {
  const [vin, setVin] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateVIN(vin);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError(undefined);
    onVINSubmit(vin.toUpperCase().trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setVin(value);
    if (error) {
      setError(undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vin-input-form">
      <Input
        label="VIN-код автомобиля"
        placeholder="Введите 17-значный VIN-код"
        value={vin}
        onChange={handleChange}
        error={error}
        maxLength={17}
        disabled={isLoading}
        className="vin-input-field"
      />
      <Button
        type="submit"
        variant="primary"
        size="medium"
        disabled={isLoading || !vin}
        className="vin-submit-button"
      >
        {isLoading ? "Поиск..." : "Найти краску"}
      </Button>
    </form>
  );
};

export default VINInput;
