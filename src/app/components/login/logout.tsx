'use client';

import { Button } from "@nextui-org/react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation'

import { RemoveLoginCookies } from "../../actions/cookies"
import Confirm from "../../components/utils/confirm";

export default function LogOut() {
    const client = createClientComponentClient();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            const { error } = await client.auth.signOut();
            if (error) {
                throw error;
            }
            RemoveLoginCookies();
            router.push('/');
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error al cerrar sesión');
        }
    }

    return (
        <>
            <Confirm
                title="Cerrar sesión"
                message="¿Está seguro que desea cerrar sesión?"
                onConfirm={handleSignOut}
                btn={(action: () => void) => <Button className="rounded-sm border-1 bg-transparent text-white hover:bg-white hover:text-black" onClick={action}>Cerrar sesión</Button>}
            />
            <Toaster />
        </>
    );
}
