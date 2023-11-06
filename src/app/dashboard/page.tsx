"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { GetLoginCookies } from "../actions/cookies";
import NavbarBase from "../components/navbars/navbar"
import Administracion from "./administracion";
import Secretaria from "./secretaria";
import Farmacia from "./farmacia";
import { type User } from "../interfaces/user";

function page() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        GetLoginCookies().then((data: User) => {
            if (data) {
                setUser(data);
            } else {
                router.push("/");
            }
        });
    }, []);

    const renderPage = () => {
        switch (user?.tipo) {
            case "Administración":
                return <Administracion />
            case "Secretaria":
                return <Secretaria />
            case "Medica":
                return <Secretaria />
            case "Farmacia":
                return <Farmacia />
            default:
                return <div></div>
        }

    }

    return (
        <div >
            <NavbarBase />
            {renderPage()}
        </div>
    )
}

export default page