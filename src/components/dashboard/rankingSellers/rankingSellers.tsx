import axios from "axios";
import { useEffect, useState } from "react"
import './rankingSellers.css'
import { Empty, Table, Button } from "antd";

function RankingSellers() {
    const [sellers, setSellers] = useState <any[]>([])

    const columns = [
        {
            title: 'Posição',
            dataIndex: 'rankPosition',
            key: 'rankPosition'
        },
        {
            title: 'Vendedor',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Valor total de vendas',
            dataIndex: 'value',
            key: 'value'
        },
        {
            title: 'Quantidade de vendas',
            dataIndex: 'productsSold',
            key: 'productsSold'
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
        <div className="ranking">
            <h2>Ranking de vendedores por valor</h2>
            <Button onClick={e => {getSellers()} }>Recarregar ranking</Button>
            {sellers.length>0 ?
            <Table columns={columns} dataSource={sellers} />
            : <Empty description={"Nenhuma venda encontrada"} />}
        </div>
    )
}

export default RankingSellers