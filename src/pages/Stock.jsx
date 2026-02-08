import { useState, useMemo } from "react";
import { flatCatalog } from "../data/flatCatalog";
import { useStock } from "../context/StockContext";

const LOW_STOCK_THRESHOLD = 5;

export default function Stock() {
  const { getProductStock } = useStock();
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return flatCatalog.filter((product) => {
      const stock = getProductStock(product.id);

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.code.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase());

      const matchesLowStock = lowStockOnly ? stock <= LOW_STOCK_THRESHOLD : true;

      return matchesSearch && matchesLowStock;
    });
  }, [search, lowStockOnly, getProductStock]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Stock</h1>

      {/* Filtros */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, código o marca..."
          className="border px-3 py-2 rounded w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={() => setLowStockOnly(!lowStockOnly)}
          />
          Bajo stock (≤ {LOW_STOCK_THRESHOLD})
        </label>
      </div>

      {/* Tabla */}
      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-3">Producto</th>
              <th className="p-3">Código</th>
              <th className="p-3">Marca</th>
              <th className="p-3">Modelo</th>
              <th className="p-3">Sistema</th>
              <th className="p-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const stock = getProductStock(product.id);
              const isLow = stock <= LOW_STOCK_THRESHOLD;

              return (
                <tr key={product.id} className="border-t">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.code}</td>
                  <td className="p-3">{product.brand}</td>
                  <td className="p-3">{product.model}</td>
                  <td className="p-3">{product.system}</td>
                  <td
                    className={`p-3 font-semibold ${
                      isLow ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {stock}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
