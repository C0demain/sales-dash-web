import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import './ListSells.css'
import { Button, Empty, Table, DatePicker, TableColumnsType } from "antd";
import SelectSeller from 'components/SelectSeller/SelectSeller'
import SelectProduct from "components/SelectProduct/SelectProduct";
import SelectClient from "components/SelectClient/SelectClient";
import { formatCurrency, formatDate } from "util/formatters";

const ListSells = () => {
    const [sells, setSells] = useState<any[]>([])
    const [userSelect, setUserSelect] = useState<any>()
    const [productSelect, setProductSelect] = useState<any>()
    const [clientSelect, setClientSelect] = useState<any>()
    const [startDate, setStartDate] = useState<any>()
    const [endDate, setEndDate] = useState<any>()

    const columns:TableColumnsType = [
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
            render: (value: string) => formatDate(value)
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
            render: value => formatCurrency(value),
            align: "end"
        },
    ]

    const handleDatePicker = (date: any) => {
        let newDate = date ? date.year() + "-" + (date.month() + 1) + "-" + date.date() : ""
        return newDate
    }

    const getSells = useCallback(async () => {
        let url = "http://localhost:8000/api/v1/sells/getfilter/"
        const userFilter = userSelect !== undefined ? 'userId=' + userSelect : ""
        const productFilter = productSelect !== undefined ? 'productId=' + productSelect : ""
        const clientFilter = clientSelect !== undefined ? 'clientId=' + clientSelect : ""
        const startDateFilter = startDate ? 'startDate=' + startDate : ""
        const endDateFilter = endDate ? 'endDate=' + endDate : ""

        let queryParams = [userFilter, productFilter, clientFilter, startDateFilter, endDateFilter]
        const query = queryParams.filter(e => e !== '').join('&')
        url += query !== "&" ? "?" + query : ""

        const response = await axios.get(url, {
            withCredentials: false,
        });
        setSells(response.data.sells);
    }, [userSelect, productSelect, clientSelect, startDate, endDate]);

    if (endDate === ''){
        setEndDate('3000-5-30')
    }

    useEffect(() => {
        getSells()
    }, [getSells])

    return (
        <div className="listSells">
            <h2>Últimas vendas</h2>
            <Button className="button-refresh" onClick={e => { getSells() }}>Recarregar vendas</Button>
            <div className="filter">
                <div className="filter-group">
                    <label className="font">Vendedor: </label>
                    <SelectSeller
                        controlState={[userSelect, setUserSelect]}
                        dataKey="id"
                        className="select"
                    />
                </div>
                <div className="filter-group">
                    <label className="font">Produto: </label>
                    <SelectProduct
                        controlState={[productSelect, setProductSelect]}
                        dataKey="id"
                        className="select"
                    />
                </div>
                <div className="filter-group">
                    <label className="font">Cliente: </label>
                    <SelectClient
                        controlState={[clientSelect, setClientSelect]}
                        dataKey="id"
                        className="select"
                    />
                </div>
                <div className="filter-group">
                    <label className="font"> Data de início:</label>
                    <DatePicker
                        onChange={e => { setStartDate(handleDatePicker(e)) }}
                        format="DD/MM/YYYY"
                        placeholder="Escolher"
                        className="select"
                    />
                </div>
                <div className="filter-group">
                    <label className="font">Data de fim:</label>
                    <DatePicker
                        onChange={e => { setEndDate(handleDatePicker(e)) }}
                        format="DD/MM/YYYY"
                        placeholder="Escolher"
                        className="select"
                    />
                </div>
            </div>

            {sells.length > 0 ?
                <Table className="listSellsTable" columns={columns} dataSource={sells} rowKey="id" />
                : <Empty description={"Nenhuma venda encontrada"} />}
        </div>
    )
}

export default ListSells
