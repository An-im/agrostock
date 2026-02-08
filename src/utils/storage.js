const STORAGE_KEY = "agro-stock-movements";

export const getMovementsFromStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveMovementsToStorage = (movements) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movements));
};

const PURCHASES_KEY = "agro-stock-purchases";

export const getPurchasesFromStorage = () => {
  const data = localStorage.getItem(PURCHASES_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePurchasesToStorage = (purchases) => {
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
};
