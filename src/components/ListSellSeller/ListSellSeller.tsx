import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import './index.css';
import { Button, Empty, Table, DatePicker, TableColumnsType } from "antd";
import SelectProduct from "components/SelectProduct/SelectProduct";
import SelectClient from "components/SelectClient/SelectClient";
import { formatCurrency, formatDate } from "util/formatters";

interface ListSellsSellerProps {
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

const ListSellsSeller = ({ onStartDateChange, onEndDateChange }: ListSellsSellerProps) => {
    const [sells, setSells] = useState<any[]>([]);
    const [userSelect, setUserSelect] = useState<any>(null);
    const [productSelect, setProductSelect] = useState<any>(null);
    const [clientSelect, setClientSelect] = useState<any>(null);
    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>('3000-5-30');

    const columns: TableColumnsType = [
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
            render: value => formatDate(value),
            sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        },
        {
            title: 'Produto',
            dataIndex: 'productName',
            key: 'productName',
            sorter: (a, b) => a.productName.localeCompare(b.productName)
        },
        {
            title: 'Cliente',
            dataIndex: 'clientname',
            key: 'clientname',
            sorter: (a, b) => a.clientname.localeCompare(b.clientname)
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            render: (value: number) => formatCurrency(value),
            align: "end"
        },
    ];

    const handleDatePicker = (date: any) => {
        let newDate = date ? date.year() + "-" + (date.month() + 1) + "-" + date.date() : "";
        return newDate;
    };

    const getSells = useCallback(async () => {
        let url = "http://localhost:8000/api/v1/sells/getfilter/";
        const userFilter = userSelect !== null ? 'userId=' + userSelect : "";
        const productFilter = productSelect !== null ? 'productId=' + productSelect : "";
        const clientFilter = clientSelect !== null ? 'clientId=' + clientSelect : "";
        const startDateFilter = startDate ? 'startDate=' + startDate : "";
        const endDateFilter = endDate ? 'endDate=' + endDate : "";

        let queryParams = [userFilter, productFilter, clientFilter, startDateFilter, endDateFilter];
        const query = queryParams.filter(e => e !== '').join('&');
        url += query ? "?" + query : "";

        const response = await axios.get(url, {
            withCredentials: false,
        });
        setSells(response.data.sells);
    }, [userSelect, productSelect, clientSelect, startDate, endDate]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && user.id) {
            setUserSelect(user.id);
        }
        setEndDate('3000-5-30');
    }, []);

    useEffect(() => {
        if (userSelect !== null) {
            getSells();
        }
    }, [getSells, userSelect]);

    return (
        <div className="ListSellsSeller">
            <h2>Últimas vendas</h2>
            <Button className="button-refresh" onClick={getSells}>Recarregar vendas</Button>
            <div className="filter">
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
                    <label className="font">Data de início:</label>
                    <DatePicker
                        onChange={e => { setStartDate(handleDatePicker(e)); onStartDateChange(handleDatePicker(e)) }}
                        format="DD/MM/YYYY"
                        placeholder="Escolher"
                        className="select"
                    />
                </div>
                <div className="filter-group">
                    <label className="font">Data de fim: </label>
                    <DatePicker
                        onChange={e => { setEndDate(handleDatePicker(e)); onEndDateChange(handleDatePicker(e)) }}
                        format="DD/MM/YYYY"
                        placeholder="Escolher"
                        className="select"
                    />
                </div>
            </div>
            {sells.length > 0 ?
                <Table className="listSellsTable" columns={columns} dataSource={sells} rowKey={'id'} />
                : <Empty description={"Nenhuma venda encontrada"} />}
        </div>
    );
};

export default ListSellsSeller;
