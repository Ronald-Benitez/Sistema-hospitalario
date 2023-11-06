"use server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { type Doctor } from "../interfaces/doctors";

export const insertDoctor = async (id: String, especialidad: String) => {
  const supabase = createServerActionClient({ cookies });

  const { data, error } = await supabase.from("doctores").insert([
    {
      id: id,
      especialidad: especialidad,
      duracion_consulta: 30,
    },
  ]);

  if (error) return false;

  return true;
};

export const updateDoctor = async (id: String, doctor: Doctor) => {
    const supabase = createServerActionClient({ cookies });

    const { data, error } = await supabase
        .from("doctores")
        .update({
        duracion_consulta: doctor.duracion_consulta,
        inicio_horario: doctor.inicio_horario,
        fin_horario: doctor.fin_horario,
        hora_descanso: doctor.hora_descanso,
        })
        .eq("id", id);

        console.log(data);
        console.log(error);
    
    if (error) return false;
    
    return true;
};

export const updateSpeciality = async (id: String, especialidad: String) => {
    const supabase = createServerActionClient({ cookies });
    console.log(id);
    console.log(especialidad);

    const { data, error } = await supabase
        .from("doctores")
        .update({
        especialidad: especialidad,
        })
        .eq("id", id);
    
    if (error) return false;
  
    return true;
}

export const getDoctorByUserId = async (id: String) => {
    const supabase = createServerActionClient({ cookies });
        
    const { data, error } = await supabase.from("doctores").select(`especialidad`).eq("id", id);
        
    if (error) return false;
        
    return data;
}

export const getDoctors = async () => {
    const supabase = createServerActionClient({ cookies });
        
    const { data, error } = await supabase.from("doctores").select(`*, usuario:usuarios(nombres, apellidos, suspendido, razon_de_suspension)`);
        
    if (error) return false;
        
    return data;
}
