import axios from "axios";
import { useEffect, useState } from "react"
import './ListSells.css'
import { Button, Empty, Table } from "antd";
import SelectSeller from '../widgets/SelectSeller'
import SelectProduct from "../widgets/SelectProduct";
import SelectClient from "../widgets/SelectClient";

const ListSells = ()=>{
    const [sells, setSells] = useState<any[]>([])
    const [userSelect, setUserSelect] = useState<any>()
    const [productSelect, setProductSelect] = useState<any>()
    const [clientSelect, setClientSelect] = useState<any>()
    
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
            dataIndex: 'productName',
            key: 'productName',
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
        let url = "http://localhost:8000/api/v1/sells/getall/filter"
        const userFilter = userSelect !== undefined ? 'userId=' + userSelect : ""
        const productFilter =  productSelect !== undefined ? 'productId=' + productSelect : ""
        const clientFilter =  clientSelect !== undefined ? 'clientId=' + clientSelect : ""
        
        const query = [userFilter, productFilter, clientFilter].join('&')
        url += query !== "&" ? "?" + query : ""


        const response = await axios.get(url, {
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
            <Button onClick={e => {getSells()} }>Recarregar vendas</Button>
            <div className="filter">
                <label>Vendedor: </label>
                <SelectSeller
                    controlState={[userSelect, setUserSelect]}
                    className="select"
                />

                <label>Produto: </label>
                <SelectProduct
                    controlState={[productSelect, setProductSelect]}
                    className="select"
                />

                <label>Cliente: </label>
                <SelectClient
                    controlState={[clientSelect, setClientSelect]}
                    className="select"
                />
                <Button onClick={e => {getSells()} } >Filtrar</Button>
            </div>
            {sells.length > 0 ?
            <Table columns={columns} dataSource={sells} />
            : <Empty description={"Nenhuma venda encontrada"} />}
        </div>
    )
}

export default ListSells
