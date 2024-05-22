import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import './index.css';
import { Empty, Table, TableColumnsType } from "antd";
import { formatCurrency, formatDate } from "util/formatters";

interface ListSellsSellerProps {
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

const ListSellsSeller = ({ onStartDateChange, onEndDateChange }: ListSellsSellerProps) => {
    const [sells, setSells] = useState<any[]>([]);
    const [userSelect, setUserSelect] = useState<any>(null);

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

    const getSells = useCallback(async () => {
        let url = "http://localhost:8000/api/v1/sells/getfilter/";
        const userFilter = userSelect !== null ? 'userId=' + userSelect : "";

        let queryParams = [userFilter];
        const query = queryParams.filter(e => e !== '').join('&');
        url += query ? "?" + query : "";

        const response = await axios.get(url, {
            withCredentials: false,
        });
        setSells(response.data.sells);
    }, [userSelect]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && user.id) {
            setUserSelect(user.id);
        }
    }, []);

    useEffect(() => {
        if (userSelect !== null) {
            getSells();
        }
    }, [getSells, userSelect]);

    return (
        <div className="ListSellsSeller">
            <h2>Últimas vendas</h2>
            {sells.length > 0 ?
                <Table className="listSellsTable" columns={columns} dataSource={sells} rowKey={'id'} pagination={{defaultPageSize: 5}} />
                : <Empty description={"Nenhuma venda encontrada"} />}
        </div>
    );
};

export default ListSellsSeller;
