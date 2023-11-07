"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { type User } from "../interfaces/user";
import AddUser from "./add";
import UsuariosTable from "./table";
import checkUserRole from "../middlewares/check-user-role";
import NavbarBase from "../components/navbars/navbar";

function Usuarios() {
    const [users, setUsers] = useState<User[]>([])
    const supabase = createClientComponentClient();

    useEffect(() => {
        checkUserRole(["Administración"])
        fetchUsers();

    }, []);

    const fetchUsers = async () => {
        const { data: usuarios, error } = await supabase
            .from('usuarios')
            .select('*');
        setUsers(usuarios as User[])
    }


    return (
        <>
            <NavbarBase />
            <div className="flex justify-center p-4 gap-1">
                <div className=" px-20 mt-5 rounded w-full sm:w-2/3 mb-4 min-w-full">
                    <AddUser />
                    <UsuariosTable usuarios={users as User[]} />
                </div>
            </div>
        </>
    );
}

export default Usuarios;
