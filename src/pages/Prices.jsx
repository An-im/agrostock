import { useMemo, useState } from "react";
import { useStock } from "../context/StockContext";
import { flatCatalog } from "../data/flatCatalog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function Prices() {
  const { purchases } = useStock();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🔎 Generamos historial plano
  const priceRows = useMemo(() => {
  let rows = [];

  purchases
    .filter(p => p.status !== "cancelled") // 👈 IMPORTANTE
    .forEach((purchase) => {
      purchase.items.forEach((item) => {
        rows.push({
          productId: item.productId,
          productName:
            flatCatalog.find(p => p.id === item.productId)?.name,
          supplierName: purchase.supplierName,
          unitCost: item.unitCost,
          date: purchase.date,
        });
      });
    });

  return rows.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

}, [purchases]);


  // 🧠 Lista de productos únicos
  const products = useMemo(() => {
    const unique = {};
    priceRows.forEach(row => {
      if (!unique[row.productId]) {
        unique[row.productId] = row.productName;
      }
    });
    return Object.entries(unique);
  }, [priceRows]);

  // 📊 Datos para gráfico
  const productHistory = useMemo(() => {
    return priceRows
      .filter(r => r.productId === selectedProduct)
      .map(r => ({
        date: new Date(r.date).toLocaleDateString(),
        price: r.unitCost,
      }));
  }, [priceRows, selectedProduct]);

  // 🔙 Volver a lista
  if (!selectedProduct) {
    return (
      <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-semibold mb-6">
          Precios por Producto
        </h1>

        <div className="grid gap-3">
          {products.map(([id, name]) => (
            <button
              key={id}
              onClick={() => setSelectedProduct(id)}
              className="p-4 border rounded-xl hover:bg-gray-50 text-left"
            >
              {name}
            </button>
          ))}

          {products.length === 0 && (
            <div className="text-gray-500">
              No hay registros de precios
            </div>
          )}
        </div>
      </div>
    );
  }

  // 📈 Vista detalle con gráfico
  return (
    <div className="max-w-5xl bg-white p-8 rounded-2xl shadow-sm">

      <button
        onClick={() => setSelectedProduct(null)}
        className="mb-4 text-sm text-gray-500 hover:underline"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-semibold mb-6">
        Historial de Precios
      </h1>

      {/* Gráfico */}
      <div className="h-72 mb-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={productHistory}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />


            {[...new Set(
              priceRows
                .filter(r => r.productId === selectedProduct)
                .map(r => r.supplierName)
            )].map((supplier, index) => {
            
              const colors = ["#000000", "#2563eb", "#dc2626", "#16a34a"];
              const color = colors[index % colors.length];
            
              return (
                <Line
                  key={supplier}
                  type="monotone"
                  dataKey="price"
                  data={priceRows
                    .filter(r =>
                      r.productId === selectedProduct &&
                      r.supplierName === supplier
                    )
                    .map(r => ({
                      date: new Date(r.date).toLocaleDateString(),
                      price: r.unitCost
                    }))
                  }
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  name={supplier}
                />
              );
            })}

        </LineChart>

        </ResponsiveContainer>
      </div>

      {/* Tabla */}
      <div className="overflow-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-3">Fecha</th>
              <th className="p-3">Proveedor</th>
              <th className="p-3">Precio</th>
            </tr>
          </thead>
          <tbody>
            {priceRows
              .filter(r => r.productId === selectedProduct)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((row, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {row.supplierName}
                  </td>
                  <td className="p-3 font-semibold">
                    ${row.unitCost.toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
