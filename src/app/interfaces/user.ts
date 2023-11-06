export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  tipo: string;
  suspendido: boolean;
  razon_de_suspension: string;
}

export interface DoctorUser {
  nombres: string;
  apellidos: string;
  suspendido: boolean;
  razon_de_suspension: string;
}