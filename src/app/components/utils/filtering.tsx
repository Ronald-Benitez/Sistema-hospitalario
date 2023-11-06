import React from "react";

interface SearchFilterProps {
    searchTerm: string;
    searchColumn: string;
    onSearchTermChange: (term: string) => void;
    onSearchColumnChange: (column: string) => void;
    searchOptions: string[]; // Nuevos props para las opciones de búsqueda
}

const SearchFilter: React.FC<SearchFilterProps> = ({
    searchTerm,
    searchColumn,
    onSearchTermChange,
    onSearchColumnChange,
    searchOptions, // Se recibe el array de opciones de búsqueda como prop
}) => {
    return (
        <div className="mb-4 min-w-full">
            <div className="flex items-center">
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="p-2 border rounded w-full"
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                />
                <select
                    className="p-2 border border-slate-200 ml-2"
                    value={searchColumn}
                    onChange={(e) => onSearchColumnChange(e.target.value)}
                >
                    {/* Mapear las opciones de búsqueda desde el array recibido */}
                    {searchOptions?.map((option) => (
                        <option key={option} value={option}>
                            {option.slice(0, 1).toUpperCase() + option.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SearchFilter;
