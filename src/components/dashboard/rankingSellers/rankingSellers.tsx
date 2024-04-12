import axios from "axios";
import { useEffect, useState } from "react"
import './rankingSellers.css'
import { Empty, Table } from "antd";

function RankingSellers() {
    const [sellers, setSellers] = useState <any[]>([])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Vendedor',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Quantidade de vendas',
            dataIndex: 'allSales',
            key: 'allSales'
        },
        {
            title: 'Valor total de vendas',
            dataIndex: 'totalValue',
            key: 'totalValue'
        }
    ]
    /* TROCAR URL */
    const getSellers = async () => {
        const response = await axios.get(`http://localhost:8000/api/v1/dashboard/ranking}`, {
          withCredentials: false,
        });
        setSellers(response.data.sells)
      };

    useEffect(() => { 
        getSellers()
        }, [])

    return(
        <div className="ranking">
            <h1>Maiores valores vendidos</h1>
            {sellers.length>0 ?
            <Table columns={columns} dataSource={sellers} />
            : <Empty description={"Nenhuma venda encontrada"} />}
        </div>
    )
}

export default RankingSellers