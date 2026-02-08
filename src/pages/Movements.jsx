import { useState, useMemo } from "react";
import { flatCatalog } from "../data/flatCatalog";
import { useStock } from "../context/StockContext";
import { v4 as uuidv4 } from "uuid";

export default function Movements() {
  const { addMovement, getProductStock, movements } = useStock();

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const filteredProducts = useMemo(() => {
    return flatCatalog.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const currentStock = selectedProduct
    ? getProductStock(selectedProduct.id)
    : 0;

  const total = Number(quantity) * Number(unitPrice);
  const formatCurrency = (value) => {
     if (!value) return "";
     return Number(value).toLocaleString("es-AR");
   };

  const lastThreeMovements = movements
  .filter((m) => m.type === "out")
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 3);


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedProduct || quantity <= 0 || unitPrice < 0) return;

    const movement = {
      id: uuidv4(),
      productId: selectedProduct.id,
      type: "out",
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      total: total,
      date: new Date().toISOString(),
      status: "active",
      reason: null,
      relatedMovementId: null,
    };

    const result = addMovement(movement);


    if (!result.success) {
      setError(result.message);
      setSuccessMessage("");
      return;
    }

    setError("");
    setSuccessMessage("Venta registrada correctamente ✔");

    setSelectedProduct(null);
    setSearch("");
    setQuantity(1);
    setUnitPrice("");
  };

  return (
    <div className="max-w-3xl">
      {/* Card principal */}
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-semibold mb-8">
          Registrar Venta
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Buscador */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar producto por nombre o código..."
              className="border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition w-full"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedProduct(null);
              }}
            />

            {search && !selectedProduct && (
              <div className="absolute bg-white border border-gray-200 w-full max-h-60 overflow-auto z-10 rounded-xl shadow mt-2">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer transition"
                      onClick={() => {
                        setSelectedProduct(product);
                        setSearch(product.name);
                      }}
                    >
                      <div className="font-medium">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.code}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500">
                    No se encontraron productos
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Producto seleccionado */}
          {selectedProduct && (
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
              {selectedProduct.image && (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div>
                <div className="font-semibold">
                  {selectedProduct.name}
                </div>
                <div className="text-sm text-gray-500">
                  Stock actual:{" "}
                  <span
                    className={`font-medium ${
                      currentStock <= 5
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {currentStock}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Cantidad */}
          <input
            type="number"
            min="1"
            className="border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition w-full"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          {/* Precio */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
              
            <input
              type="text"
              placeholder="Precio unitario"
              value={formatCurrency(unitPrice)}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                setUnitPrice(raw);
              }}
              className="border border-gray-200 pl-8 pr-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>



          {/* Total */}
          <div className="text-right font-semibold text-lg">
            Total: ${total.toLocaleString("es-AR")}
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-3 rounded-xl hover:opacity-90 transition font-medium"
          >
            Guardar Venta
          </button>

          {error && (
            <div className="text-red-600 font-medium">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="text-green-600 font-medium">
              {successMessage}
            </div>
          )}
        </form>
      </div>

      {/* Últimos movimientos */}
      <div className="mt-10 bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Últimos movimientos
        </h2>

        {lastThreeMovements.length === 0 && (
          <div className="text-gray-500">
            No hay movimientos registrados
          </div>
        )}

        <div className="divide-y">
          {lastThreeMovements.map((m) => {
  const product = flatCatalog.find(
    (p) => p.id === m.productId
  );

  return (
    <div
      key={m.id}
      className="py-4 flex justify-between items-center"
    >
      <div>
        <div className="font-medium">
          {product?.name}
        </div>

        <div className="text-sm text-gray-500">
          {new Date(m.date).toLocaleString()}
        </div>
      </div>

      <div
        className={`font-semibold text-lg ${
          m.status === "cancelled"
            ? "text-gray-400 line-through"
            : "text-red-600"
        }`}
      >
        -{m.quantity}
      </div>
    </div>
  );
})}

        </div>
      </div>
    </div>
  );
}
