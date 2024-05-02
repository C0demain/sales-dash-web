import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import './index.css'
import { Button, Empty, Table, DatePicker } from "antd";
import SelectProduct from "components/SelectProduct/SelectProduct";
import SelectClient from "components/SelectClient/SelectClient";

const ListSellsSeller = ()=>{
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


    const getSells = useCallback(async () => {
        let url = "http://localhost:8000/api/v1/sells/getall/"
        const userFilter = userSelect !== undefined ? 'userId=' + userSelect : ""
        const productFilter =  productSelect !== undefined ? 'productId=' + productSelect : ""
        const clientFilter =  clientSelect !== undefined ? 'clientId=' + clientSelect : ""
        const startDateFilter = startDate ? 'startDate=' + startDate: ""
        const endDateFilter = endDate ? 'endDate=' + endDate: ""
        
        let queryParams = [userFilter, productFilter, clientFilter, startDateFilter, endDateFilter]
        const query = queryParams.filter(e => e !== '').join('&')
        url += query !== "&" ? "?" + query : ""
    
        const response = await axios.get(url, {
          withCredentials: false,
        });
        setSells(response.data.sells);
    }, [userSelect, productSelect, clientSelect, startDate, endDate]);

    useEffect(() => { 
        getSells()
        }, [getSells])
    
        useEffect(()=>{
            let user = JSON.parse(localStorage.getItem('user')||'')
            setUserSelect(user.id)
        }, [])

    return (
        <div className="ListSellsSeller">
            <h2>Últimas vendas</h2>
            <Button onClick={e => {getSells()} }>Recarregar vendas</Button>
            <div className="filter">

                <label className="font">Produto: </label>
                <SelectProduct
                    controlState={[productSelect, setProductSelect]}
                    dataKey="id"
                    className="select"
                />

                <label className="font">Cliente: </label>
                <SelectClient
                    controlState={[clientSelect, setClientSelect]}
                    dataKey="id"
                    className="select"
                />

                <label className="font"> Data de início: </label>
                <DatePicker 
                    onChange={e => { setStartDate(handleDatePicker(e)) }}
                    className="select"
                />

                <label className="font">Data de fim: </label>
                <DatePicker 
                    onChange={e => {setEndDate(handleDatePicker(e))}}
                    className="select"
                />
            </div>
            {sells.length > 0 ?
            <Table columns={columns} dataSource={sells} />
            : <Empty description={"Nenhuma venda encontrada"} />}
        </div>
    )
}

export default ListSellsSeller