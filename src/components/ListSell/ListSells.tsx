import axios from "axios";
import { useEffect, useState } from "react"
import './ListSells.css'
import { Button, Empty, Table, DatePicker } from "antd";
import SelectSeller from 'components/SelectSeller/SelectSeller'
import SelectProduct from "components/SelectProduct/SelectProduct";
import SelectClient from "components/SelectClient/SelectClient";

const ListSells = ()=>{
    const [sells, setSells] = useState<any[]>([])
    const [userSelect, setUserSelect] = useState<any>()
    const [productSelect, setProductSelect] = useState<any>()
    const [clientSelect, setClientSelect] = useState<any>()
    const [startDate, setStartDate] = useState<any>()
    const [endDate, setEndDate] = useState<any>()
    
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
            render: (value: number) => formatCurrency(value)
        },
    ]

    const formatCurrency = (value: number): string => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const handleDatePicker = (date: any) => {
        let newDate = date ? date.year() + "-" + (date.month()+1) + "-" + date.date() : ""
        return newDate
    }

    const getSells = async () => {
        let url = "http://localhost:8000/api/v1/sells/getall/"
        const userFilter = userSelect !== undefined ? 'userId=' + userSelect : ""
        const productFilter =  productSelect !== undefined ? 'productId=' + productSelect : ""
        const clientFilter =  clientSelect !== undefined ? 'clientId=' + clientSelect : ""
        const startDateFilter = startDate !== null ? 'startDate=' + startDate: ""
        const endDateFilter = endDate !== undefined ? 'endDate=' + endDate: ""
        
        let queryParams = [userFilter, productFilter, clientFilter, startDateFilter, endDateFilter]
        const query = queryParams.filter(e => e !== '').join('&')
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
                    dataKey="id"
                    className="select"
                />

                <label>Produto: </label>
                <SelectProduct
                    controlState={[productSelect, setProductSelect]}
                    dataKey="id"
                    className="select"
                />

                <label>Cliente: </label>
                <SelectClient
                    controlState={[clientSelect, setClientSelect]}
                    dataKey="id"
                    className="select"
                />

                <label>Data de início: </label>
                <DatePicker 
                    onChange={e => { setStartDate(handleDatePicker(e)) }}
                    className="select"
                />

                <label>Data de fim: </label>
                <DatePicker 
                    onChange={e => {setEndDate(handleDatePicker(e))}}
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
