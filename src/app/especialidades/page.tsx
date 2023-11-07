"use client"

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { type Speciality } from "../interfaces/specialities";
import AddSpeciality from "./add";
import EspecialitiesTable from "./table";
import checkUserRole from "../middlewares/check-user-role";
import NavbarBase from "../components/navbars/navbar";


function Especialidades() {
    const supabase = createClientComponentClient();
    const [specialties, setSpecialties] = useState<Speciality[]>([])

    useEffect(() => {
        checkUserRole(["Administración"])
        fetchSpecialties();

    }, []);

    const fetchSpecialties = async () => {
        const { data: especialidades, error } = await supabase
            .from('especialidades')
            .select('*');
        setSpecialties(especialidades as Speciality[])
    }

    return (
        <>
            <NavbarBase />
            <div className="flex justify-center p-4 gap-1">
                <div className=" px-20 mt-5 rounded w-full sm:w-2/3 mb-4 min-w-full">
                    <AddSpeciality speciality={null} />
                    <EspecialitiesTable data={specialties} />
                </div>
            </div>
        </>
    );
}

export default Especialidades;
