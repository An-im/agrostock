import { createContext, useContext, useEffect, useState } from "react";
import {
  getMovementsFromStorage,
  saveMovementsToStorage,
  getPurchasesFromStorage,
  savePurchasesToStorage,
} from "../utils/storage";
import { calculateStock } from "../utils/stock";

const StockContext = createContext();

export const StockProvider = ({ children }) => {

  // 🔹 Movements
  const [movements, setMovements] = useState(() => {
    return getMovementsFromStorage();
  });

  useEffect(() => {
    saveMovementsToStorage(movements);
  }, [movements]);

  // 🔹 Purchases
  const [purchases, setPurchases] = useState(() => {
    return getPurchasesFromStorage();
  });

  useEffect(() => {
    savePurchasesToStorage(purchases);
  }, [purchases]);
  
  const getProductStock = (productId) => {
    return calculateStock(movements, productId);
  };


  // ✅ ADD MOVEMENT (ventas)
  const addMovement = (movement) => {
    if (movement.type === "out") {
      const currentStock = calculateStock(movements, movement.productId);

      if (movement.quantity > currentStock) {
        return {
          success: false,
          message: "Stock insuficiente para realizar la salida.",
        };
      }
    }

    setMovements((prev) => [...prev, movement]);
    return { success: true };
  };

  // ✅ ADD PURCHASE (compras a proveedor)
  const addPurchase = (purchase) => {
    // Guardar compra
    setPurchases((prev) => [...prev, purchase]);

    // Generar movimientos automáticos de entrada
    const newMovements = purchase.items.map((item) => ({
      id: crypto.randomUUID(),
      productId: item.productId,
      type: "in",
      quantity: item.quantity,
      date: purchase.date,
      status: "active",
      reason: null,
      relatedMovementId: null,
      source: "purchase",
      sourceId: purchase.id,
    }));

    setMovements((prev) => [...prev, ...newMovements]);

    return { success: true };
  };

  // ✅ CANCEL MOVEMENT
const cancelMovement = (movementId, reason) => {
  const movementToCancel = movements.find(
    (m) => m.id === movementId
  );

  if (!movementToCancel || movementToCancel.status === "cancelled") {
    return { success: false };
  }

  const updatedMovements = movements.map((m) =>
    m.id === movementId
      ? { ...m, status: "cancelled", reason }
      : m
  );

  setMovements(updatedMovements);

  return { success: true };
};

// ✅ CANCEL PURCHASE (DEBE ESTAR FUERA)
const cancelPurchase = (purchaseId) => {

  // 1️⃣ Marcar compra como cancelada
  const updatedPurchases = purchases.map((p) =>
    p.id === purchaseId
      ? { ...p, status: "cancelled" }
      : p
  );

  setPurchases(updatedPurchases);

  // 2️⃣ Cancelar movimientos asociados
  const updatedMovements = movements.map((m) =>
    m.source === "purchase" &&
    m.sourceId === purchaseId
      ? { ...m, status: "cancelled" }
      : m
  );

  setMovements(updatedMovements);

  return { success: true };
};


  return (
    <StockContext.Provider
      value={{
        movements,
        purchases,
        addMovement,
        addPurchase,
        cancelMovement,
        cancelPurchase,
        getProductStock,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext);
