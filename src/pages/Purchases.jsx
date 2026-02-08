import { useState } from "react";
import { flatCatalog } from "../data/flatCatalog";
import { useStock } from "../context/StockContext";
import { suppliers } from "../data/suppliers";

export default function Purchases() {
  const { addPurchase } = useStock();

  const [supplier, setSupplier] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [items, setItems] = useState([]);
  const [success, setSuccess] = useState("");

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        search: "",
        quantity: 1,
        unitCost: 0,
      },
    ]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity) * Number(item.unitCost),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!supplier || items.length === 0) return;

    const purchase = {
      id: crypto.randomUUID(),
      supplierId: supplier,
      supplierName:
        suppliers.find((s) => s.id === supplier)?.name,
      invoiceNumber,
      date,
      items: items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
      })),
      total,
    };

    addPurchase(purchase);

    setSupplier("");
    setInvoiceNumber("");
    setItems([]);
    setSuccess("Compra registrada correctamente ✔");
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-semibold mb-8">
          Registrar Compra
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* Datos generales */}
          <div className="grid grid-cols-3 gap-4">
            <select
              value={supplier}
              onChange={(e) =>
                setSupplier(e.target.value)
              }
              className="border px-4 py-3 rounded-xl"
            >
              <option value="">
                Seleccionar proveedor
              </option>
              {suppliers.map((s) => (
                <option
                  key={s.id}
                  value={s.id}
                >
                  {s.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="N° Factura"
              value={invoiceNumber}
              onChange={(e) =>
                setInvoiceNumber(e.target.value)
              }
              className="border px-4 py-3 rounded-xl"
            />

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              className="border px-4 py-3 rounded-xl"
            />
          </div>

          {/* Items */}
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">
              Productos
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              + Agregar Producto
            </button>
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-5 gap-4 items-center bg-gray-50 p-4 rounded-xl"
            >
              {/* Buscador producto */}
              <div className="flex flex-col relative">
                <label className="text-xs text-gray-500 mb-1">
                  Producto
                </label>

                <input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  value={item.search}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "search",
                      e.target.value
                    )
                  }
                  className="border px-3 py-2 rounded-lg"
                />

                {item.search && (
                  <div className="absolute top-16 bg-white border w-full max-h-40 overflow-auto rounded-lg shadow z-20">
                    {flatCatalog
                      .filter(
                        (product) =>
                          product.name
                            .toLowerCase()
                            .includes(
                              item.search.toLowerCase()
                            ) ||
                          product.code
                            .toLowerCase()
                            .includes(
                              item.search.toLowerCase()
                            )
                      )
                      .slice(0, 5)
                      .map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            updateItem(
                              index,
                              "productId",
                              product.id
                            );
                            updateItem(
                              index,
                              "search",
                              `${product.code} — ${product.name}`
                            );
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                          {product.code} —{" "}
                          {product.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Cantidad */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "quantity",
                      e.target.value
                    )
                  }
                  className="border px-3 py-2 rounded-lg"
                />
              </div>

              {/* Costo Unitario */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">
                  Costo Unitario
                </label>
                <input
                  type="number"
                  min="0"
                  value={item.unitCost}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "unitCost",
                      e.target.value
                    )
                  }
                  className="border px-3 py-2 rounded-lg"
                />
              </div>

              {/* Subtotal */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">
                  Subtotal
                </label>
                <div className="font-semibold">
                  $
                  {(
                    Number(item.quantity) *
                    Number(item.unitCost)
                  ).toLocaleString("es-AR")}
                </div>
              </div>

              {/* Eliminar */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() =>
                    removeItem(index)
                  }
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="text-right font-semibold text-lg">
            Total: $
            {total.toLocaleString("es-AR")}
          </div>

          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Guardar Compra
          </button>

          {success && (
            <div className="text-green-600 font-medium">
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
