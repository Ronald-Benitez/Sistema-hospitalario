"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';

import { type Speciality } from "../interfaces/specialities";
import AddSpeciality from "./add";
import EspecialitiesTable from "./table";
import checkUserRole from "../middlewares/check-user-role";
import NavbarBase from "../components/navbars/navbar";

async function Especialidades() {
    checkUserRole(["Administración"])

    const supabase = createServerComponentClient({ cookies });
    const { data: especialidades, error } = await supabase
        .from('especialidades')
        .select('*');

    return (
        <>
            <NavbarBase />
            <div className="flex justify-center p-4 gap-1">
                <div className=" px-20 mt-5 rounded w-full sm:w-2/3 mb-4 min-w-full">
                    <AddSpeciality speciality={null} />
                    <EspecialitiesTable data={especialidades as Speciality[]} />
                </div>
            </div>
        </>
    );
}

export default Especialidades;
