"use client"

import { useState, useEffect } from 'react';
import { parseExcelFile } from '../actions/files';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Chip } from '@nextui-org/react';
import moment from 'moment';
import { IconDeviceFloppy, IconFileDownload } from '@tabler/icons-react';

import { validateMedicineData } from '../actions/medicines';
import { MedicineInsert } from '../interfaces/medicines';
import { masiveInsertMedicines } from '../actions/medicines';

const HandleFiles: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [validData, setValidData] = useState<MedicineInsert[]>([]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target || !e.target.files || !e.target.files[0]) return;

        try {
            const parsedData = await parseExcelFile(e.target.files[0]);
            setData(parsedData);
        } catch (error) {
            toast.error(error as string);
        }

        e.target.value = '';
    };

    useEffect(() => {
        if (data.length === 0) return;
        validateMedicineData(data).then(({ errors, validData }) => {
            setErrors(errors);
            setValidData(validData || []);
        });

    }, [data]);

    const handleInsertMedicines = async () => {
        if (validData.length === 0) return;

        const inserted = await masiveInsertMedicines(validData);
        if (!inserted) {
            toast.error('Hubo un error al registrar los medicamentos.');
        } else {
            toast.success('Medicamentos ingresados correctamente.');
            setData([]);
            setErrors([]);
            setValidData([]);

        }
    };

    const handleDownload = () => {
        const downloadUrl = "/files/plantilla_lote_medicamentos.xlsx";
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "plantilla_lote_medicamentos.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col items-center justify-center">

            <Chip color="default" >
                <p className='text-white'>
                    Selecciona un archivo de Excel con los medicamentos a ingresar (.xlsx)
                </p>
            </Chip>
            <div className='my-5 flex justify-center flex-col gap-2'>
                <Button 
                    onClick={handleDownload}
                    size="md"
                >
                    <IconFileDownload size={25} />
                    <label >
                        Descargar plantilla
                    </label>
                </Button>

                <input
                    type="file"
                    onChange={(handleFileUpload)}
                    className='rounded-lg bg-[#d1d2d4] p-1'
                    accept='.xlsx'
                />
            </div>

            {
                errors.length === 0 && validData.length > 0 && (
                    <Button
                        className="bg-slate-900 hover:bg-black rounded-sm"
                        onClick={handleInsertMedicines}
                        size="md"
                    >
                        <IconDeviceFloppy size={25} className="mr-2 text-white" />
                        <p className='text-white'>
                            Guardar medicamentos
                        </p>
                    </Button>
                )
            }

            {errors.length > 0 && (
                <div className="p-4 rounded my-4 px-10 bg-red-600 text-white w-unit-12xl">
                    <h2 className="text-xl font-bold mb-2 text-center">Errores</h2>
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {validData.length > 0 && (
                <div className="p-4 rounded my-4 bg-green-400 w-unit-12xl">
                    <h2 className="text-xl font-bold mb-2 text-center">Datos válidos</h2>
                    <table className="w-full border-collapse border border-black ">
                        <thead>
                            <tr>
                                <th className="border border-black p-2">Nombre</th>
                                <th className="border border-black p-2">Ubicación</th>
                                <th className="border border-black p-2">Expiración</th>
                                <th className="border border-black p-2">Requiere aprobación</th>
                                <th className="border border-black p-2">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {validData.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-black p-2">{item.nombre}</td>
                                    <td className="border border-black p-2">{item.ubicacion}</td>
                                    <td className="border border-black p-2">{moment(item.expiracion as string, "YYYY-MM-DD").format("DD/MM/YYYY")}</td>
                                    <td className="border border-black p-2">{item.requiere_aprobacion ? "x" : ""}</td>
                                    <td className="border border-black p-2">{item.cantidad.toString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Toaster />
        </div>
    );
};

export default HandleFiles;
