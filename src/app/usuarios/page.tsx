"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';

import { type User } from "../interfaces/user";
import AddUser from "./add";
import UsuariosTable from "./table";
import checkUserRole from "../middlewares/check-user-role";
import NavbarBase from "../components/navbars/navbar";

async function Usuarios() {
    checkUserRole(["Administración"])

    const supabase = createServerComponentClient({ cookies });
    const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('*');

    return (
        <>
            <NavbarBase />
            <div className="flex justify-center p-4 gap-1">
                <div className=" px-20 mt-5 rounded w-full sm:w-2/3 mb-4 min-w-full">
                    <AddUser />
                    <UsuariosTable usuarios={usuarios as User[]} />
                </div>
            </div>
        </>
    );
}

export default Usuarios;
