import { useStock } from "../context/StockContext";
import { flatCatalog } from "../data/flatCatalog";
import { useState } from "react";

export default function History() {
  const { movements, purchases, cancelMovement, cancelPurchase } = useStock();

  const [filterType, setFilterType] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const getProductName = (productId) => {
    const product = flatCatalog.find((p) => p.id === productId);
    return product ? product.name : "Producto eliminado";
  };
  const getSupplierName = (movement) => {
  if (movement.source !== "purchase") return "—";

  const purchase = purchases.find(
    (p) => p.id === movement.sourceId
  );

  return purchase ? purchase.supplierName : "—";
};


  const filteredMovements =
    filterType === "all"
      ? movements
      : movements.filter((m) => m.type === filterType);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Historial</h1>

      <select
        className="border px-3 py-2 rounded mb-4"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="all">Todos</option>
        <option value="in">Entradas</option>
        <option value="out">Salidas</option>
      </select>

      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-3">Producto</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Cantidad</th>
              <th className="p-3">Proveedor</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Acciones</th>

            </tr>
          </thead>
        <tbody>
  {filteredMovements.map((m) => (
    <tr key={m.id} className="border-t">

      {/* Producto */}
      <td className="p-3">
        <div className="font-medium">
          {getProductName(m.productId)}
        </div>

        {m.reason && (
          <div className="text-xs text-gray-500 mt-1">
            Motivo: {m.reason}
          </div>
        )}
      </td>

      {/* Tipo */}
      <td className="p-3">
        {m.type === "in" ? "Entrada" : "Salida"}
      </td>

      {/* Cantidad */}
      <td className="p-3">{m.quantity}</td>

      {/* Proveedor */}
      <td className="p-3">
        {getSupplierName(m)}
      </td>

      {/* Estado */}
      <td className="p-3">
        {m.status === "cancelled" ? (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 font-medium">
            Anulado
          </span>
        ) : (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
            Activo
          </span>
        )}
      </td>

      {/* Fecha */}
      <td className="p-3">
        {new Date(m.date).toLocaleString()}
      </td>

      {/* Acciones */}
      <td className="p-3">
        {m.status !== "cancelled" && (
          <button
            onClick={() => setSelectedId(m.id)}
            className="text-red-600 hover:underline text-sm"
          >
            Anular
          </button>
        )}
      </td>

    </tr>
  ))}
</tbody>


        </table>
        {selectedId && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">
        Motivo de anulación
      </h2>

      <textarea
        className="border border-gray-200 w-full p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-black transition"
        placeholder="Escribe el motivo..."
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setSelectedId(null);
            setCancelReason("");
          }}
          className="px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Cancelar
        </button>

        <button
          onClick={() => {
            if (!cancelReason.trim()) return;

            const movement = movements.find(m => m.id === selectedId);

            if (movement.source === "purchase") {
              cancelPurchase(movement.sourceId);
            } else {
              cancelMovement(selectedId, cancelReason);
            }
          
            setSelectedId(null);
            setCancelReason("");
          }}

          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
