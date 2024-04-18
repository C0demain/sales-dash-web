import axios from "axios";
import { useEffect, useState } from "react"
import { Empty, Table, Button } from "antd";
import NavbarWrapper from "../../Barra_lateral/NavbarWrapper/NavbarWrapper";
import Navbargest from "../../Barra_lateral/Barra_lateral_gestor";

function ListaCliente() {
    const [sellers, setSellers] = useState <any[]>([])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'rankPosition',
            key: 'rankPosition'
        },
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Total de Compras',
            dataIndex: 'value',
            key: 'value'
        },
        {
            title: 'Ações',
            dataIndex: 'value',
            key: 'value'
        },

    ]

    const getSellers = async () => {
        const response = await axios.get(`http://localhost:8000/api/v1/dashboard/ranking`, {
          withCredentials: false,
        });

        const ranking = response.data.ranking.map((e: any, k: number) => ({...e, rankPosition: k+1}))
        

        setSellers(ranking)
      };

    useEffect(() => { 
        getSellers()
        }, [])

    return(
        <NavbarWrapper>
        <Navbargest/>
        <div className="ranking">
            <h2>Lista de Clientes</h2>
            <Button onClick={e => {getSellers()} }>Recarregar clientes</Button>
            {sellers.length>0 ?
            <Table columns={columns} dataSource={sellers} />
            : <Empty description={"Nenhuma venda encontrada"} />}
        </div>
        </NavbarWrapper>
    )
}

export default ListaCliente