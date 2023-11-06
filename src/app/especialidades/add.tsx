"use client"

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { IconPencil } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

import { insertEspeciality, updateEspeciality } from "../actions/specialities";
import { type Speciality } from "../interfaces/specialities";


export default function AddSpeciality({ speciality }: { speciality: Speciality | null }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState<string>(speciality ? speciality.nombre : "");



    const saveUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name) {
            toast.error("Debe ingresar el nombre de la especialidad");
            return;
        }

        const registrado = speciality ? updateEspeciality(speciality.id, name) : insertEspeciality(name);

        if (!registrado) {
            toast.error("Ocurrió un error al guardar la información de la especialidad");
            return;
        }

        toast.success(`Se ha ${speciality ? "actualizado" : "registrado"} la especialidad ${name} correctamente`);
        onClose();
    };

    return (
        <>
            {speciality ? (
                <Button onClick={onOpen} className="rounded-sm" size="sm" color="warning">
                    <IconPencil size={18} />
                </Button>
            ) : (
                <Button onClick={onOpen} className="rounded-sm m-1">
                    Registrar una nueva especialidad
                </Button>
            )}
            <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader className="flex justify-center text-2xl">Registrar una nueva especialidad</ModalHeader>
                    <ModalBody>
                        <form onSubmit={saveUser}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                                    Nombre
                                </label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="mt-1 p-2 border rounded w-full"
                                    label="Ingrese el nombre de la especialidad"
                                    isRequired
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                            </div>
                            <div className="flex justify-around my-4">

                                <Button type="submit" className="bg-black text-white rounded hover:bg-slate-950 px-10">
                                    {
                                        speciality ? "Actualizar" : "Registrar"
                                    }
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Cerrar</Button>
                    </ModalFooter>
                </ModalContent>
                <Toaster />
            </Modal>
        </>
    );


}