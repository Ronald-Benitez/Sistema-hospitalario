"use server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const insertEspeciality = async (especiality: string) => {
  const supabase = createServerActionClient({ cookies });

  const { data, error } = await supabase.from("especialidades").insert([
    {
      nombre: especiality,
    },
  ]);

  if (error) return false;

  return true;
};

export const updateEspeciality = async (id: Number, especiality: string) => {
  const supabase = createServerActionClient({ cookies });

  const { data, error } = await supabase
    .from("especialidades")
    .update({
      nombre: especiality,
    })
    .eq("id", id);

  if (error) return false;

  return true;
};

export const deleteEspeciality = async (id: Number) => {
  const supabase = createServerActionClient({ cookies });

  const { data, error } = await supabase
    .from("especialidades")
    .delete()
    .eq("id", id);

  if (error) return false;

  return true;
};

export const getSpecialities = async () => {
  const supabase = createServerActionClient({ cookies });

  const { data, error } = await supabase.from("especialidades").select("*");

  if (error) return false;

  return data;
};
