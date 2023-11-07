'use client'

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast, { Toaster } from "react-hot-toast";
import { useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import PublicNavbar from "@/app/components/navbars/public-nav";
import AdminNavbar from "@/app/components/navbars/admin-nav";
import SecretariaNavbar from "./secretaria-nav";
import FarmaciaNavbar from "./farmacia-nav";
import { GetLoginCookies, RemoveLoginCookies, SetLoginCookies } from "@/app/actions/cookies";
import { type User } from "@/app/interfaces/user";
import UsuarioSuspendido from "../login/usuario-suspendido";

export const dynamic = 'force-dynamic'

export default function NavbarBase() {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClientComponentClient();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    useEffect(() => {
        GetLoginCookies().then((data: User) => {
            if (data) {
                setUser(data);
            }
        });
    }, []);

    useEffect(() => {
        if (user && user.suspendido) {
            onOpen();
        }
    }, [user]);

    const onCloseSuspendido = () => {
        onClose();
        RemoveLoginCookies();
        setUser(null);
        router.push("/");
    };


    if (user) {
        supabase
            .channel("custom-filter-channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "usuarios",
                    filter: `id=eq.${user.id}`,
                },
                (payload) => {
                    setUser(payload.new as User);
                    toast.success("Se ha actualizado la información de su usuario");
                    SetLoginCookies(JSON.stringify(payload.new));
                }
            )
            .subscribe();
    }

    const renderNavbar = () => {
        switch (user?.tipo) {
            case "Administración":
                return <AdminNavbar />;
            case "Secretaria":
                return <SecretariaNavbar />;
            case "Medica":
                return <SecretariaNavbar />;
            case "Farmacia":
                return <FarmaciaNavbar />;
            default:
                return <PublicNavbar />;
        }
    };

    return (
        <>
            {renderNavbar()}
            <Toaster />
            <UsuarioSuspendido
                message={user?.razon_de_suspension || ""}
                isOpen={isOpen}
                onClose={onCloseSuspendido}
                onOpen={onOpen}
            />
        </>
    )
}
