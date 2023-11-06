"use server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface User {
  id: string;
  nombres: string;
  apellidos: string;
  tipo: string;
}

export const insertUser = async (user: User) => {
  const supabase = createServerActionClient({ cookies });

  const { data, error } = await supabase.from("usuarios").insert([
    {
      id: user.id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      tipo: user.tipo,
      suspendido: false,
      razon_de_suspension: "",
    },
  ]);

  if (error) return false;

  return true;
};

export const updateUser = async (user: User) => {
  const supabase = createServerActionClient({ cookies });

  const { data, error } = await supabase
    .from("usuarios")
    .update({
      nombres: user.nombres,
      apellidos: user.apellidos,
      tipo: user.tipo,
    })
    .eq("id", user.id);

  if (error) return false;

  return true;
};

export const toggleSupend = async (
  id: string,
  suspendido: boolean,
  razon: string
) => {
  const supabase = createServerActionClient({ cookies });

  const { data, error } = await supabase
    .from("usuarios")
    .update({
      suspendido: !suspendido,
      razon_de_suspension: razon,
    })
    .eq("id", id);

  if (error) return false;

  return true;
};

