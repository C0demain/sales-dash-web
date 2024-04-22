/* https://codesandbox.io/p/sandbox/lingering-architecture-383p9l?file=%2Findex.tsx */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Empty, Table, Button } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/AdminNavbar/AdminNavbar";

function ShowClient() {
    const [clients, setClients] = useState([]);

    const columns = [

        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Segmento',
            dataIndex: 'segment',
            key: 'segment'
        },
        {
            title: 'CPF / CNPJ',
            dataIndex: 'cpf_cnpj',
            key: 'cpf_cnpj'
        }

    ];

    const getClients = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/clients/getclients`);
            if (response.data && response.data.clients) {
                setClients(response.data.clients);
            } else {
                setClients([]);
            }
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            setClients([]);
        }
    };

    useEffect(() => {
        getClients();
    }, []);

    return (
        <NavbarWrapper>
            <Navbargest/>
            <div className="ranking">
                <h2>Lista de Clientes</h2>
                <Button onClick={getClients}>Recarregar clientes</Button>
                {clients.length > 0 ? (
                    <Table columns={columns} dataSource={clients} />
                ) : (
                    <Empty description={"Nenhum cliente encontrado"} />
                )}
            </div>
        </NavbarWrapper>
    );
}

export default ShowClient;
