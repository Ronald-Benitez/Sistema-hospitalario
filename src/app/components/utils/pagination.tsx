import React from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Button } from "@nextui-org/react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}) => {
    const itemsPerPageOptions = [1, 5, 10, 20]; // Opciones para el selector de items por página

    return (
        <div className="mt-4 mx-2 flex justify-between overflow-auto">
            <div className="flex items-center">
                <p className="text-sm text-gray-700">
                    Página
                    <span className="font-medium"> {currentPage} </span>
                    de
                    <span className="font-medium"> {totalPages} </span>
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <IconArrowLeft size={"18"} />
                </Button>
                <Button disabled size="sm">
                    <span className="sr-only">Current page</span>
                    <span className="font-medium text-gray-900">{currentPage}</span>
                </Button>
                <Button
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <IconArrowRight size={"18"} />
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Elementos por página:</span>
                <select
                    className="border border-slate-200 p-2"
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    value={itemsPerPage}
                >
                    {itemsPerPageOptions.map((option) => (
                        <option value={option} key={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Pagination;
