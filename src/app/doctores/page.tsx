import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';

import { type DoctorWithUser } from "../interfaces/doctors";
import DoctorsTable from "./table";
import checkUserRole from "../middlewares/check-user-role";
import NavbarBase from "../components/navbars/navbar";

async function Doctores() {
    checkUserRole(["Administración"])

    const supabase = createServerComponentClient({ cookies });
    const { data: doctores, error } = await supabase
        .from('doctores')
        .select(`*, usuario:usuarios(nombres, apellidos, suspendido, razon_de_suspension)`);

    return (
        <>
            <NavbarBase />
            <div className="flex justify-center p-4 gap-1">
                <div className=" px-20 mt-5 rounded w-full sm:w-2/3 mb-4 min-w-full">
                    <DoctorsTable data={doctores as DoctorWithUser[]} />
                </div>
            </div>
        </>
    );
}

export default Doctores;
