'use client';

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@nextui-org/react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast, { Toaster } from 'react-hot-toast';
import { SetLoginCookies, RemoveLoginCookies } from "../../actions/cookies";
import { useRouter } from 'next/navigation'

import UsuarioSuspendido from "./usuario-suspendido";
import { type User } from "@/app/interfaces/user";

export default function Login() {
    const [userLocal, setUserLocal] = useState<User | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenSuspendido, onOpen: onOpenSuspendido, onClose: onCloseSuspendido } = useDisclosure();

    const client = createClientComponentClient();
    const router = useRouter();

    const handleSignIn = async (formData: FormData) => {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const { data: { user } } = await client.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (!user) throw new Error();

            const { data } = await client.from('usuarios').select('*').eq('id', user?.id);

            if (!data) {
                throw new Error();
            }

            onClose();
            setUserLocal(data[0]);

            if (data[0] && data[0].suspendido) {
                onOpenSuspendido();
                RemoveLoginCookies();
                return;
            }

            SetLoginCookies(JSON.stringify(data[0]));
            toast.success('Inicio de sesión exitoso');
            router.push('/dashboard');

        } catch (error) {
            toast.error('Ocurrió un error al iniciar sesión');
        }
    }

    return (
        <>
            <Button className="rounded-sm border-1 bg-transparent text-white hover:bg-white hover:text-black" onClick={onOpen}>Iniciar sesión</Button>
            <Modal isOpen={isOpen} onClose={onClose} className="rounded" backdrop="blur">
                <ModalContent>
                    <form action={handleSignIn}>
                        <ModalHeader className="text-3xl font-semibold mb-6 text-center text-black">Sistema de Control Hospitalario</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="mt-1 p-2 border rounded w-full"
                                    placeholder="Ingrese su correo electrónico"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="mt-1 p-2 border rounded w-full text-black"
                                    placeholder="Ingrese su contraseña"
                                    required
                                />
                            </div>
                            <div className="flex justify-around my-4">
                                <Button onClick={onClose} className="text-black rounded  hover:bg-zinc-400">
                                    Cancelar
                                </Button>
                                <Button type="submit" className="bg-black text-white rounded hover:bg-slate-950">
                                    Iniciar Sesión
                                </Button>
                            </div>
                        </ModalBody>
                    </form>
                </ModalContent>
            </Modal>
            <UsuarioSuspendido
                message={userLocal?.razon_de_suspension || ""}
                isOpen={isOpenSuspendido}
                onClose={onCloseSuspendido}
                onOpen={onOpenSuspendido} />
            <Toaster />
        </>
    );
}
