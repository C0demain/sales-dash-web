import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import './ListSells.css'
import { Empty, Table, TableColumnsType } from "antd";
import { formatCurrency, formatDate } from "util/formatters";

const ListSells = () => {
    const [sells, setSells] = useState<any[]>([])

    const columns:TableColumnsType = [
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
            render: (value: string) => formatDate(value),
            sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            defaultSortOrder: "descend"
        },
        {
            title: 'Vendedor',
            dataIndex: 'seller',
            key: 'seller',
            sorter: (a, b) => a.seller.localeCompare(b.seller)
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
            render: value => formatCurrency(value),
            align: "end"
        },
    ]

    const getSells = useCallback(async () => {
        let url = "http://localhost:8000/api/v1/sells/getfilter/"

        const response = await axios.get(url, {
            withCredentials: false,
        });
        setSells(response.data.sells);
    }, []);

    useEffect(() => {
        getSells()
    }, [getSells])

    return (
        <div className="listSells">
            <h2>Últimas vendas</h2>
            {sells.length > 0 ?
                <Table className="listSellsTable" columns={columns} dataSource={sells} rowKey="id" pagination={{defaultPageSize: 5}} />
                : <Empty description={"Nenhuma venda encontrada"} />}
        </div>
    )
}

export default ListSells
