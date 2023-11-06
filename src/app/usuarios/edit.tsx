"use client"

import { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Input } from "@nextui-org/react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast, { Toaster } from "react-hot-toast";
import { IconPencil } from "@tabler/icons-react";

import { updateUser } from "../actions/user";
import { type User } from "../interfaces/user";
import { type Speciality } from "../interfaces/specialities";
import { getSpecialities } from "../actions/specialities";
import { updateSpeciality, insertDoctor, getDoctorByUserId } from "../actions/doctors";

export default function EditUser({ user }: { user: User }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [formData, setFormData] = useState<User>(user);
    const [specialities, setSpecialities] = useState<Speciality[]>([]);
    const [speciality, setSpeciality] = useState<String | null>(null);
    const [area, setArea] = useState<String | null>(user.tipo);

    const loadDoctor = async () => {
        if (user.tipo != "Medica") return;
        const doctor = await getDoctorByUserId(user.id);
        if (!doctor) return;
        setSpeciality(doctor[0].especialidad);
    }

    useEffect(() => {
        loadDoctor();
    }, []);

    const saveUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!verifyNoVoid()) return;
        if (formData.tipo == "Medica" && speciality == null) {
            toast.error("No puede haber campos vacíos");
            return;
        }

        const actualizado = updateUser(formData);

        if (!actualizado) {
            toast.error("Ocurrió un error al guardar la información del usuario");
            return;
        }

        if (formData.tipo == "Medica") {
            const especialidadActualizada = area === "Medica" ? await updateSpeciality(user.id, speciality as string) : await insertDoctor(user.id, speciality as string);
            if (!especialidadActualizada) {
                toast.error("Ocurrió un error al guardar la información del doctor");
                return;
            }
            setArea("Medica");
        }

        toast.success(`Se ha actualizado la información del usuario ${formData.nombres} ${formData.apellidos}`);
        onClose();
    };

    const verifyNoVoid = () => {
        if (formData.nombres == "" || formData.apellidos == "" || formData.tipo == "") {
            toast.error("No puede haber campos vacíos");
            return false;
        }
        return true;
    }

    const loadSpecialities = async () => {
        if (formData.tipo != "Medica") return setSpecialities([]);
        const data = await getSpecialities();
        if (!data) {
            toast.error("Ocurrió un error al cargar las especialidades");
            return;
        }

        setSpecialities(data);
    }

    useEffect(() => {
        loadSpecialities();
    }, [formData.tipo]);

    return (
        <>
            <Button onClick={onOpen} className="rounded-sm" size="sm" color="warning">
                <IconPencil size={18} />
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader className="flex justify-center text-2xl">Editar un usuario</ModalHeader>
                    <ModalBody>
                        <form onSubmit={saveUser}>
                            <div className="mb-4">
                                <label htmlFor="nombres" className="block text-sm font-medium text-gray-600">
                                    Nombres
                                </label>
                                <Input
                                    isRequired
                                    type="text"
                                    id="nombres"
                                    name="nombres"
                                    className="mt-1 p-2 border rounded w-full"
                                    label="Ingrese los nombres"
                                    onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                                    value={formData.nombres || ""}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="apellidos" className="block text-sm font-medium text-gray-600">
                                    Apellidos
                                </label>
                                <Input
                                    isRequired
                                    type="text"
                                    id="apellidos"
                                    name="apellidos"
                                    className="mt-1 p-2 border rounded w-full"
                                    label="Ingrese los apellidos"
                                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                                    value={formData.apellidos || ""}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="area" className="block text-sm font-medium text-gray-600">
                                    Área
                                </label>
                                <Select
                                    required
                                    className="border border-slate-200"
                                    value={formData.tipo}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                    label="Seleccione el área"
                                    isRequired
                                    defaultSelectedKeys={[formData.tipo]}
                                    isDisabled={area == "Medica"}
                                >
                                    <SelectItem value="Administración" key="Administración">Administración</SelectItem>
                                    <SelectItem value="Secretaria" key="Secretaria">Secretaria</SelectItem>
                                    <SelectItem value="Medica" key="Medica">Medica</SelectItem>
                                    <SelectItem value="Farmacia" key="Farmacia">Farmacia</SelectItem>
                                </Select>
                            </div>
                            {
                                specialities.length > 0 && (
                                    <div className="mb-4">
                                        <label htmlFor="especialidad" className="block text-sm font-medium text-gray-600">
                                            Especialidad
                                        </label>
                                        <Select
                                            isRequired
                                            className="border border-slate-200"
                                            onChange={(e) => setSpeciality(e.target.value)}
                                            label="Seleccione la especialidad"
                                            defaultSelectedKeys={[speciality as string]}
                                        >
                                            {specialities.map((speciality) => (
                                                <SelectItem value={speciality.nombre} key={speciality.nombre}>
                                                    {speciality.nombre}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                )
                            }
                            <div className="flex justify-around my-4">

                                <Button type="submit" className="bg-black text-white rounded hover:bg-slate-950 px-10">
                                    Guardar cambios
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