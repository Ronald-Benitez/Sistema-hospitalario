"use client"

import { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

import HandleFiles from "./handleFiles";
import AddMedicine from "./add";
import SearchMedicine from "./search";

export default function App() {
    return (
        <div className="flex w-full flex-col">
            <Tabs aria-label="Options">
                <Tab key="lot" title="Lote">
                    <Card>
                        <CardBody>
                            <HandleFiles />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="medicine" title="Medicamento">
                    <Card>
                        <CardBody>
                            <AddMedicine />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="search" title="Buscar">
                    <Card>
                        <CardBody>
                            <SearchMedicine />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="dispatch" title="Despachar">
                    <Card>
                        <CardBody>
                            Completa el proceso de despacho para una receta.
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="expiring" title="Por Vencer">
                    <Card>
                        <CardBody>
                            Visualiza los medicamentos próximos a vencer.
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="expired" title="Vencidos">
                    <Card>
                        <CardBody>
                            Revisa los medicamentos que han vencido.
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="export" title="Exportar">
                    <Card>
                        <CardBody>
                            Exporta datos de medicamentos en un archivo.
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
}
