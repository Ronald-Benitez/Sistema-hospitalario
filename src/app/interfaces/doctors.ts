import { DoctorUser } from "./user";

export interface Doctor {
  id: String;
  created_at: String;
  especialidad: String;
  duracion_consulta: Number;
  inicio_horario: String;
  fin_horario: String;
  hora_descanso: String;
}

export type DoctorWithUser = {
  id: string;
  created_at: string;
  especialidad: string;
  duracion_consulta: number;
  inicio_horario: String;
  fin_horario: String;
  hora_descanso: String;
  usuario: DoctorUser;
};
