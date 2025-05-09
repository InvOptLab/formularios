import React, { createContext, useState, useContext } from "react";

type FontSizeContextType = {
  scale: number;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
};

const FontSizeContext = createContext<FontSizeContextType | undefined>(
  undefined
);

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scale, setScale] = useState(0); // 0 = padrão, 1 = +1, -1 = -1

  const increase = () => setScale((prev) => prev + 1);
  const decrease = () => setScale((prev) => prev - 1);
  const reset = () => setScale(0);

  return (
    <FontSizeContext.Provider value={{ scale, increase, decrease, reset }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return context;
};
