import * as XLSX from "xlsx";
import moment from "moment";
import { MedicineInsert } from "../interfaces/medicines";

export function parseExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const target = e.target;
      if (!target) {
        reject("Error al leer el archivo");
        return;
      }
      const data = target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];
      const dataParse: any[] = XLSX.utils.sheet_to_json(ws);

      // Modificar el formato de la fecha de expiración usando moment.js
      const formattedData: MedicineInsert[] = dataParse.map((item: any) => {
        return {
          ...item,
          expiracion: formatDate(item.expiracion),
        };
      });

      // Validar las columnas
      const columnErrors: string[] = [];
      const expectedColumns: (keyof MedicineInsert)[] = [
        "nombre",
        "ubicacion",
        "expiracion",
        "requiere_aprobacion",
        "cantidad",
      ];

      if (formattedData.length > 0) {
        const actualColumns = Object.keys(formattedData[0]);
        if (!expectedColumns.every((col) => actualColumns.includes(col))) {
          columnErrors.push(
            "La estructura de las columnas no coincide con la esperada."
          );
        }
      } else {
        columnErrors.push("El archivo está vacío o no contiene datos.");
      }

      if (columnErrors.length > 0) {
        reject(columnErrors);
      }

      resolve(formattedData);
    };

    reader.readAsBinaryString(file);
  });
}

function formatDate(expirationDate: number): string {
  const date = moment((expirationDate - 25569) * 86400 * 1000).add(1, 'day'); // Sumar un día para compensar la diferencia
  return date.format("DD/MM/YYYY");
}
