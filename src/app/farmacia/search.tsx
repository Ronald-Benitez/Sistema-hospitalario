"use client"

import { useState, useEffect } from 'react'
import { Button, Input, Chip } from '@nextui-org/react'
import { useDebounce } from "@uidotdev/usehooks";
import toast, { Toaster } from 'react-hot-toast';
import moment from 'moment';

import { searchMedicine } from '../actions/medicines'
import { type Medicine } from '../interfaces/medicines'
import Pagination from '../components/utils/pagination';

const ITEMS_PER_PAGE = 5;

interface Count {
  total: number;
  expired: number;
  nearExpiration: number;
}

function SearchMedicine() {
  const [search, setSearch] = useState<string>('')
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [count, setCount] = useState<Count>({
    total: 0,
    expired: 0,
    nearExpiration: 0
  });

  useEffect(() => {
    if (debouncedSearch) {
      setLoading(true)
      searchMedicine(debouncedSearch).then((data) => {
        if (data) {
          setMedicines(data)
          handleCount(data);
        } else {
          setMedicines([])
          setCount({
            total: 0,
            expired: 0,
            nearExpiration: 0
          })
        }
      })
    } else {
      setMedicines([])
    }
  }, [debouncedSearch])

  const handleCount = (data: Medicine[]) => {
    //use the cantidad field to count the total of medicines, expired is 5 days or less and near expiration is 10 days or more
    const total = data.reduce((acc, medicine) => acc + Number(medicine.cantidad), 0);
    const expired = data.filter((medicine) => {
      const expirationDate = moment(medicine.expiracion as string);
      const today = moment();
      const difference = expirationDate.diff(today, 'days');
      return difference <= 5;
    }).reduce((acc, medicine) => acc + Number(medicine.cantidad), 0);
    const nearExpiration = data.filter((medicine) => {
      const expirationDate = moment(medicine.expiracion as string);
      const today = moment();
      const difference = expirationDate.diff(today, 'days');
      return difference <= 10 && difference > 5;
    }).reduce((acc, medicine) => acc + Number(medicine.cantidad), 0);

    setCount({
      total,
      expired,
      nearExpiration
    });

  };

  const getColorBasedOnDifference = (difference: number) => {
    if (difference <= 5) {
      return "danger";
    } else if (difference <= 10) {
      return "warning";
    } else {
      return "success";
    }
  };

  const chipStyleGenerator = (medicine: Medicine) => {
    const expirationDate = moment(medicine.expiracion as string);
    const today = moment();
    const difference = expirationDate.diff(today, 'days');
    const color = getColorBasedOnDifference(difference);

    return (
      <Chip
        color={color}
        className="m-1"
      >
        {moment(medicine.expiracion as string).format('DD/MM/YYYY') + " (" + difference + " días)"}
      </Chip>
    );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicines = medicines.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(medicines.length / itemsPerPage);

  return (

    <div className="mb-4 min-w-full">
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="Buscar medicamento..."
          className="p-2 border rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>
      <div className="flex items-center">
        <Chip color="default" className="m-1">
          Total: {count.total}
        </Chip>
        <Chip color="danger" className="m-1">
          Expirados: {count.expired}
        </Chip>
        <Chip color="warning" className="m-1">
          Por expirar: {count.nearExpiration}
        </Chip>

      </div>

      <div className="mb-8 overflow-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200 border border-slate-300 ">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Ingreso</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Ubicación</th>
              <th className="px-4 py-2">Fecha de expiración</th>
              <th className="px-4 py-2">Requiere aprobación</th>
              <th className="px-4 py-2">Cantidad</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200 border">

            {currentMedicines.map((medicine, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{moment(medicine.created_at as string).format('DD/MM/YYYY')}</td>
                <td className="border px-4 py-2">{medicine.nombre}</td>
                <td className="border px-4 py-2">{medicine.ubicacion}</td>
                <td className="border px-4 py-2">{chipStyleGenerator(medicine)}</td>
                <td className="border px-4 py-2">{medicine.requiere_aprobacion ? 'Si' : 'No'}</td>
                <td className="border px-4 py-2">{String(medicine.cantidad)}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
      <div className="mt-4 mx-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={
            (value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }
          }
        />
      </div>

      <Toaster />
    </div>
  )
}

export default SearchMedicine
