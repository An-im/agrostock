import { useState } from "react";
import { useStock } from "../context/StockContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { flatCatalog } from "../data/flatCatalog";



export default function Reports() {
  const { purchases, movements } = useStock();

  const today = new Date();
  const defaultMonth = String(today.getMonth() + 1).padStart(2, "0");
  const defaultYear = String(today.getFullYear()).slice(2);
  
  const [reportMonth, setReportMonth] = useState(
    `${defaultMonth}/${defaultYear}`
  );

  const [month, shortYear] = reportMonth.split("/");

  const year = shortYear
    ? Number("20" + shortYear)
    : null;


  // 🔹 Filtrar compras del mes
  const monthlyPurchases = purchases.filter((p) => {
    const d = new Date(p.date);
    return (
      d.getFullYear() === Number(year) &&
      d.getMonth() + 1 === Number(month)
    );
  });

  // 🔹 Filtrar ventas del mes
  const monthlySales = movements.filter((m) => {
    const d = new Date(m.date);
    return (
      m.type === "out" &&
      m.status === "active" &&
      d.getFullYear() === Number(year) &&
      d.getMonth() + 1 === Number(month)
    );
  });

  const totalPurchases = monthlyPurchases.reduce(
    (sum, p) => sum + p.total,
    0
  );

  const totalSales = monthlySales.reduce(
    (sum, m) => sum + (m.total || 0),
    0
  );

  const balance = totalSales - totalPurchases;

  // ===========================
  // 📄 PDF COMPRAS
  // ===========================
  const generatePurchasesPDF = () => {
    if (monthlyPurchases.length === 0) {
      alert("No hay compras en ese mes");
      return;
    }

    const doc = new jsPDF();

    doc.text(
      `AgroStock - Reporte Compras ${reportMonth}`,
      14,
      15
    );

    const tableData = monthlyPurchases.map((p) => [
      new Date(p.date).toLocaleDateString(),
      p.supplierName,
      `$${p.total.toLocaleString("es-AR")}`,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [["Fecha", "Proveedor", "Total"]],
      body: tableData,
    });

    doc.text(
      `Total del mes: $${totalPurchases.toLocaleString("es-AR")}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save(`reporte-compras-${reportMonth}.pdf`);
  };

  // ===========================
  // 📄 PDF VENTAS
  // ===========================
  const generateSalesPDF = () => {
    if (monthlySales.length === 0) {
      alert("No hay ventas en ese mes");
      return;
    }

    const doc = new jsPDF();

    doc.text(
      `AgroStock - Reporte Ventas ${reportMonth}`,
      14,
      15
    );

    const tableData = monthlySales.map((m) => [
      new Date(m.date).toLocaleDateString(),
      m.quantity,
      `$${(m.total || 0).toLocaleString("es-AR")}`,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [["Fecha", "Cantidad", "Total"]],
      body: tableData,
    });

    doc.text(
      `Total ventas del mes: $${totalSales.toLocaleString("es-AR")}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save(`reporte-ventas-${reportMonth}.pdf`);
  };
  const { getProductStock } = useStock();

const generateInventoryReport = () => {
  const productsWithStock = flatCatalog
    .map((product) => ({
      ...product,
      stock: getProductStock(product.id),
    }))
    .filter((p) => p.stock > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (productsWithStock.length === 0) {
    alert("No hay stock disponible");
    return;
  }

  const doc = new jsPDF();

  // 📅 Fecha
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-AR");

  // 🏷 Título
  doc.setFontSize(16);
  doc.text("AgroStock - Inventario Actual", 14, 15);

  // 📆 Fecha debajo del título
  doc.setFontSize(10);
  doc.text(`Fecha de emisión: ${formattedDate}`, 14, 22);

  // 📦 Tabla
  const tableData = productsWithStock.map((p) => [
    p.name,
    p.code,
    p.brand,
    p.model,
    p.system,
    p.stock,
  ]);

  autoTable(doc, {
    startY: 30, // importante para que no se pise con la fecha
    head: [["Producto", "Código", "Marca", "Modelo", "Sistema", "Stock"]],
    body: tableData,
  });

  // 🔢 Total general
  const totalUnits = productsWithStock.reduce(
    (sum, p) => sum + p.stock,
    0
  );

  doc.text(
    `Total de unidades en stock: ${totalUnits}`,
    14,
    doc.lastAutoTable.finalY + 10
  );

  // 💾 Nombre con fecha automática
  doc.save(
    `inventario-${today.toISOString().slice(0, 10)}.pdf`
  );
};

const exportBackup = () => {
  const data = {
    movements: localStorage.getItem("agro-stock-movements"),
    purchases: localStorage.getItem("agro-stock-purchases"),
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "text/plain;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `agrostock-backup-${new Date()
    .toISOString()
    .slice(0, 10)}.txt`;

  link.click();
};
const importBackup = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const content = JSON.parse(e.target.result);

      if (
        !content.movements ||
        !content.purchases
      ) {
        alert("Archivo inválido");
        return;
      }

      const confirmRestore = window.confirm(
        "⚠ Esto reemplazará todos los datos actuales. ¿Continuar?"
      );

      if (!confirmRestore) return;

      localStorage.setItem(
        "agro-stock-movements",
        content.movements
      );

      localStorage.setItem(
        "agro-stock-purchases",
        content.purchases
      );

      alert("Backup restaurado correctamente ✅");
      window.location.reload();
    } catch (error) {
      alert("Error al restaurar el backup");
    }
  };

  reader.readAsText(file);
};

  return (
    <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-6">
        Reportes Mensuales
      </h1>

      <div className="flex items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="MM/AA"
          value={reportMonth}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
        
            if (value.length >= 3) {
              value = value.slice(0, 2) + "/" + value.slice(2, 4);
            }
        
            setReportMonth(value.slice(0, 5));
          }}
          className="border px-4 py-2 rounded-lg w-28 text-center"
        />

      </div>

      {/* Resumen en pantalla */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="text-sm text-gray-500">
            Compras del mes
          </div>
          <div className="text-xl font-semibold">
            ${totalPurchases.toLocaleString("es-AR")}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="text-sm text-gray-500">
            Ventas del mes
          </div>
          <div className="text-xl font-semibold">
            ${totalSales.toLocaleString("es-AR")}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="text-sm text-gray-500">
            Resultado
          </div>
          <div
            className={`text-xl font-semibold ${
              balance >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            ${balance.toLocaleString("es-AR")}
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4">
        <button
          onClick={generatePurchasesPDF}
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Descargar Reporte Compras
        </button>

        <button
          onClick={generateSalesPDF}
          className="bg-gray-800 text-white px-6 py-3 rounded-xl"
        >
          Descargar Reporte Ventas
        </button>
        <button
          onClick={generateInventoryReport}
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Descargar Inventario Actual
        </button>
        <button
          type="button"
          onClick={exportBackup}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg"
        >
          Descargar Backup
        </button>
        <div className="flex gap-4 mt-4">
  <button
    type="button"
    onClick={exportBackup}
    className="bg-gray-900 text-white px-4 py-2 rounded-lg"
  >
    Descargar Backup
  </button>

  <label className="bg-gray-200 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 transition">
    Restaurar Backup
    <input
      type="file"
      accept=".txt"
      onChange={importBackup}
      className="hidden"
    />
  </label>
</div>

      </div>
    </div>
  );
}
