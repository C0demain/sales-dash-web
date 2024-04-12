import axios from "axios";
import { useEffect, useState } from "react"
import './ListSells.css'
import { Empty, Table } from "antd";

const ListSells = ()=>{
    const [sells, setSells] = useState<any[]>([])
    
    const columns = [
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Vendedor',
            dataIndex: 'seller',
            key: 'seller',
        },
        {
            title: 'Produto',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Cliente',
            dataIndex: 'clientname',
            key: 'clientname',
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
        },
    ]

    const getSells = async () => {
        const response = await axios.get("http://localhost:8000/api/v1/sells/getall", {
          withCredentials: false,
        });
        setSells(response.data.sells)
      };

    useEffect(() => { 
        getSells()
        }, [])

    return (
        <div className="listSells">
            <h2>Últimas vendas</h2>
            {sells.length > 0 ?
            <Table columns={columns} dataSource={sells} />
            : <Empty description={"Nenhuma venda encontrada"} />}
        </div>
    )
}

export default ListSells
