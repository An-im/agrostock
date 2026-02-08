export const calculateStock = (movements, productId) => {
  return movements
    .filter(
      (m) =>
        m.productId === productId &&
        m.status !== "cancelled"
    )
    .reduce((total, movement) => {
      if (movement.type === "in") {
        return total + movement.quantity;
      }

      if (movement.type === "out") {
        return total - movement.quantity;
      }

      if (movement.type === "adjustment") {
        return total + movement.quantity;
      }

      return total;
    }, 0);
};
