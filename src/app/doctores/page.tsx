"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { type DoctorWithUser } from "../interfaces/doctors";
import DoctorsTable from "./table";
import checkUserRole from "../middlewares/check-user-role";
import NavbarBase from "../components/navbars/navbar";

function Doctores() {
    const [doctors, setDoctors] = useState<DoctorWithUser[]>([])
    const supabase = createClientComponentClient();

    useEffect(() => {
        checkUserRole(["Administración"])
        fetchDoctors();

    }, []);

    const fetchDoctors = async () => {
        const { data: doctores, error } = await supabase
            .from('doctores')
            .select(`*, usuario:usuarios(nombres, apellidos, suspendido, razon_de_suspension)`);
        setDoctors(doctores as DoctorWithUser[])
    }


    return (
        <>
            <NavbarBase />
            <div className="flex justify-center p-4 gap-1">
                <div className=" px-20 mt-5 rounded w-full sm:w-2/3 mb-4 min-w-full">
                    <DoctorsTable data={doctors} />
                </div>
            </div>
        </>
    );
}

export default Doctores;
