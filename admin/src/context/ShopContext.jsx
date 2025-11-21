import React, { createContext, useState } from "react";

// создаём контекст
export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [selectedShop, setSelectedShop] = useState("");

  return (
    <ShopContext.Provider value={{ selectedShop, setSelectedShop }}>
      {children}
    </ShopContext.Provider>
  );
};
