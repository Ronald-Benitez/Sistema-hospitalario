import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button, Input, Switch } from "@nextui-org/react";
import moment from "moment";

import { insertMedicine } from "../actions/medicines";
import { MedicineInsert } from "../interfaces/medicines";

export default function AddMedicine() {
    const [medicineData, setMedicineData] = useState<MedicineInsert>({
        nombre: "",
        ubicacion: "",
        expiracion: "",
        requiere_aprobacion: false,
        cantidad: 0,
    });

    function validateMedicineData() {
        if (!medicineData.nombre || !medicineData.ubicacion || !medicineData.expiracion || String(medicineData.cantidad) === "") {
            return "Por favor, complete todos los campos.";
        }

        const sixDaysFromNow = moment().add(6, "days");
        const expiracionDate = moment(medicineData.expiracion as string);

        if (expiracionDate.isBefore(sixDaysFromNow)) {
            return "La fecha de expiración debe ser al menos 6 días a partir de hoy.";
        }

        if (Number(medicineData.cantidad) <= 0) {
            return "La cantidad debe ser mayor a 0.";
        }

        return null; // La validación pasó sin errores
    }


    const saveMedicine = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationError = validateMedicineData();

        if (validationError) {
            toast.error(validationError);
            return;
        }

        const registrado = await insertMedicine(medicineData);

        if (!registrado) {
            toast.error("Ocurrió un error al guardar la información del medicamento.");
            return;
        }

        toast.success(`Se ha registrado el medicamento ${medicineData.nombre} correctamente.`);
        setMedicineData({
            nombre: "",
            ubicacion: "",
            expiracion: "",
            requiere_aprobacion: false,
            cantidad: 0,
        });
    };

    return (
        <div className="mt-4 p-4 border rounded-lg mx-auto w-1/3 sm:w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Registrar un nuevo medicamento</h2>
            <form onSubmit={saveMedicine}>
                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-600">
                        Nombre del medicamento
                    </label>
                    <Input
                        isRequired
                        type="text"
                        id="nombre"
                        name="nombre"
                        className="mt-1 p-2 border rounded w-full"
                        onChange={(e) => setMedicineData({ ...medicineData, nombre: e.target.value })}
                        value={medicineData.nombre as string}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-600">
                        Ubicación
                    </label>
                    <Input
                        type="text"
                        id="ubicacion"
                        name="ubicacion"
                        className="mt-1 p-2 border rounded w-full"
                        onChange={(e) => setMedicineData({ ...medicineData, ubicacion: e.target.value })}
                        value={medicineData.ubicacion as string}
                        isRequired
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="expiracion" className="block text-sm font-medium text-gray-600">
                        Fecha de expiración
                    </label>
                    <Input
                        type="date"
                        id="expiracion"
                        name="expiracion"
                        className="mt-1 p-2 border rounded w-full"
                        onChange={(e) => setMedicineData({ ...medicineData, expiracion: e.target.value })}
                        value={medicineData.expiracion as string}
                        isRequired
                    />
                </div>

                <div className="mb-4 flex flex-row gap-2">
                    <label htmlFor="requiere_aprobacion" className="block text-sm font-medium text-gray-600">
                        Requiere aprobación
                    </label>
                    <Switch
                        id="requiere_aprobacion"
                        name="requiere_aprobacion"
                        onChange={(e) => setMedicineData({ ...medicineData, requiere_aprobacion: !medicineData.requiere_aprobacion })}
                        isSelected={medicineData.requiere_aprobacion as boolean}
                    />

                </div>

                <div className="mb-4">
                    <label htmlFor="cantidad" className="block text-sm font-medium text-gray-600">
                        Cantidad
                    </label>
                    <Input
                        type="number"
                        id="cantidad"
                        name="cantidad"
                        className="mt-1 p-2 border rounded w-full"
                        onChange={(e) => setMedicineData({ ...medicineData, cantidad: parseInt(e.target.value) })}
                        value={medicineData.cantidad.toString()}
                        isRequired
                    />
                </div>

                <div className="flex justify-around my-4">
                    <Button type="submit" className="bg-black text-white rounded hover:bg-slate-950 px-10">
                        Registrar
                    </Button>
                </div>
            </form>
        </div>
    );
}
