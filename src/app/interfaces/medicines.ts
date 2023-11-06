export interface Medicine {
  id: String;
  created_at: String;
  nombre: String;
  ubicacion: String;
  expiracion: String;
  requiere_aprobacion: Boolean;
  cantidad: Number;
}

export interface MedicineInsert {
  nombre: String;
  ubicacion: String;
  expiracion: String;
  requiere_aprobacion: Boolean;
  cantidad: Number;
}