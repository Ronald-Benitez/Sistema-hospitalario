"use server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { MedicineInsert, Medicine } from "../interfaces/medicines";
import moment from "moment";

interface ValidationResult {
  errors: string[];
  validData?: MedicineInsert[];
}

export async function validateMedicineData(
  data: any[]
): Promise<ValidationResult> {
  const errors: string[] = [];
  const validData: MedicineInsert[] = [];

  data.forEach((item, index) => {
    if (!item.nombre || typeof item.nombre !== "string") {
      errors.push(
        `Fila ${index + 1}: El nombre del medicamento es inválido o está vacío.`
      );
    }

    if (!item.ubicacion || typeof item.ubicacion !== "string") {
      errors.push(
        `Fila ${
          index + 1
        }: La ubicación del medicamento es inválida o está vacía.`
      );
    }

    if (!item.expiracion || !moment(item.expiracion, "D/MM/YYYY").isValid()) {
      errors.push(
        `Fila ${index + 1}: La fecha de expiración del medicamento es inválida.`
      );
    } else {
      const sixDaysFromNow = moment().add(6, "days").format("DD/MM/YYYY");

      if (
        moment(item.expiracion, "DD/MM/YYYY").isBefore(sixDaysFromNow, "day")
      ) {
        errors.push(
          `Fila ${
            index + 1
          }: La fecha de expiración debe ser al menos 6 días a partir de hoy (Formato: Día/Mes/Año).`
        );
      }
    }

    if (
      !item.cantidad ||
      typeof item.cantidad !== "number" ||
      isNaN(item.cantidad) ||
      item.cantidad <= 0
    ) {
      errors.push(
        `Fila ${
          index + 1
        }: La cantidad del medicamento es inválida o está vacía.`
      );
    }

    if (!item.requiere_aprobacion) {
      item.requiere_aprobacion = false;
    } else {
      item.requiere_aprobacion = true;
    }

    if (errors.length === 0) {
      // No hay errores, agregar el objeto con requiere_aprobacion actualizado a los datos válidos
      validData.push({
        nombre: item.nombre,
        ubicacion: item.ubicacion,
        expiracion: moment(item.expiracion, "D/MM/YYYY").format("YYYY-MM-DD"),
        requiere_aprobacion: item.requiere_aprobacion,
        cantidad: item.cantidad,
      });
    }
  });

  // Devolver un objeto con 'errors' y 'validData' (con 'errors' como un array vacío por defecto)
  return { errors: errors, validData: validData };
}

export const masiveInsertMedicines = async (data: MedicineInsert[]) => {
  const supabase = createServerActionClient({ cookies });
  const { data: insertData, error } = await supabase
    .from("medicamentos")
    .insert(data);

  if (error) return false;

  return true;
};

export const insertMedicine = async (data: MedicineInsert) => {
  const supabase = createServerActionClient({ cookies });
  const { data: insertData, error } = await supabase
    .from("medicamentos")
    .insert([data]);

  if (error) return false;

  return true;
};

export const searchMedicine = async (search: string) => {
  const supabase = createServerActionClient({ cookies });
  const { data: searchData, error } = await supabase
    .from("medicamentos")
    .select("*")
    .ilike("nombre", `%${search}%`)
    .order("nombre, expiracion", { ascending: true });

  if (error) return false;

  return searchData as Medicine[];
}