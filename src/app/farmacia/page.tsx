import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';

import checkUserRole from "../middlewares/check-user-role";
import NavbarBase from "../components/navbars/navbar";
import HandleFiles from "./handleFiles";
import Hotbar from "./hotbar";

async function Usuarios() {
    checkUserRole(["Administración", "Farmacia"])



    return (
        <>
            <NavbarBase />
            <div className="flex justify-center gap-1">
                <div className=" px-20 mt-5 rounded w-full sm:w-2/3 mb-4 min-w-full">
                    <Hotbar />
                </div>
            </div>
        </>
    );
}

export default Usuarios;
