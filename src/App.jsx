import { useState } from "react";
import Movements from "./pages/Movements";
import History from "./pages/History";
import Stock from "./pages/Stock";
import Purchases from "./pages/Purchases";
import Prices from "./pages/Prices";
import Reports from "./pages/Reports";


function App() {
  const [page, setPage] = useState("movements");

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-md p-6 flex flex-col gap-6">
        <h1 className="text-xl font-bold">AgroStock</h1>
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setPage("movements")}
            className={`text-left px-3 py-2 rounded-lg transition ${
              page === "movements"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Ventas
          </button>

          <button
            onClick={() => setPage("history")}
            className={`text-left px-3 py-2 rounded-lg transition ${
              page === "history"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Historial
          </button>

          <button
            onClick={() => setPage("purchases")}
            className={`text-left px-3 py-2 rounded-lg transition ${
              page === "purchases"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Compras
          </button>

          <button
            onClick={() => setPage("stock")}
            className={`text-left px-3 py-2 rounded-lg transition ${
              page === "stock"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Stock
          </button>
         
          <button
            onClick={() => setPage("prices")}
            className={`text-left px-3 py-2 rounded-lg transition ${
              page === "prices"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Precios
          </button>
          <button
            onClick={() => setPage("reports")}
            className={`text-left px-3 py-2 rounded-lg transition ${
              page === "reports"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Reportes
          </button>

        </nav>
      </aside>


      {/* Main Content */}
      <main className="flex-1 p-10">
        
        {page === "movements" && <Movements />}
        {page === "history" && <History />}
        {page === "stock" && <Stock />}
        {page === "purchases" && <Purchases />}
        {page === "prices" && <Prices />}
        {page === "reports" && <Reports />}

      </main>
    </div>
  );
}

export default App;
