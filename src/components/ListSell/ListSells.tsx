import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import './index.css'
import { Button, Empty, Spin, Table, TableColumnsType } from "antd";
import { customLocale, formatCurrency, formatDate } from "util/formatters";

const ListSells = () => {
    const [sells, setSells] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true);

    const columns: TableColumnsType = [
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
        setLoading(true);
        let url = "http://localhost:8000/api/v1/sells/getfilter/"

        const response = await axios.get(url, {
            withCredentials: false,
        });
        setSells(response.data.sells);
        setLoading(false);
    }, []);

    useEffect(() => {
        getSells()
    }, [getSells])

    return (
        <div className="listSells">
            <Spin spinning={loading}>
                {sells.length > 0 ?
                    <>
                        <h2>Últimas vendas</h2>
                        <Button type="primary" className="custom-button-refresh" onClick={getSells}>Recarregar</Button>
                        <Table
                            className="listSellsTable"
                            columns={columns}
                            dataSource={sells}
                            rowKey="id"
                            pagination={{ defaultPageSize: 5 }}
                            locale={customLocale}
                        />
                    </>
                    : <Empty description={"Nenhuma venda encontrada"} />}
            </Spin>
        </div>
    )
}

export default ListSells
