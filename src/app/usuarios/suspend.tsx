"use client"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Chip } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { IconPlayerPauseFilled, IconPlayerPlayFilled } from "@tabler/icons-react";

import { toggleSupend } from "../actions/user";
import { type User } from "../interfaces/user";

export default function SuspendUser({ user }: { user: User }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [razon, setRazon] = useState<string>("");

    const confirm = () => {
        if (!razon && !user.suspendido) {
            toast.error("Debe ingresar una razón para suspender al usuario");
            return;
        }
        const suspendido = toggleSupend(user.id, user.suspendido, razon);

        if (!suspendido) {
            toast.error("Ocurrió un error al suspender al usuario");
            return;
        }

        toast.success(`El usuario ${user.nombres} ${user.apellidos} ha sido ${user.suspendido ? "activado" : "suspendido"}`);
        onClose();
    }

    return (
        <>
            <Button size="sm" onClick={onOpen} className="rounded-sm">
                {
                    user.suspendido ? <IconPlayerPlayFilled size={15}/> : <IconPlayerPauseFilled size={15}/>
                }
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
                <ModalContent>
                    <ModalHeader className="felx justify-center text-2xl">Suspender usuario</ModalHeader>
                    <ModalBody>
                        <p>¿Está seguro que desea {user.suspendido ? "activar" : "suspender"} al usuario <Chip color="warning">{user.nombres} {user.apellidos}</Chip> ?</p>
                        {
                            !user.suspendido &&
                            <Input
                                label="Razón"
                                placeholder="Ingrese una razón para suspender al usuario"
                                onChange={(e) => setRazon(e.target.value)}
                            />
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} className="rounded-sm">Cancelar</Button>
                        <Button className="rounded-sm bg-black text-white" onClick={confirm}>{
                            user.suspendido ? "Activar" : "Suspender"

                        }</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Toaster />
        </>
    )

}