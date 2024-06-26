import { useCallback, useEffect, useState } from "react";
import './index.css';
import { Button, Empty, Spin, Table, TableColumnsType } from "antd";
import { customLocale, formatCurrency, formatDate } from "util/formatters";
import { apiBackend, apiInstance } from "services/api";

interface ListSellsSellerProps {
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

const ListSellsSeller = ({ onStartDateChange, onEndDateChange }: ListSellsSellerProps) => {
    const [sells, setSells] = useState<any[]>([]);
    const [userSelect, setUserSelect] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const customIndicator = <div style={{ display: 'none' }} />;

    const columns: TableColumnsType = [
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
            render: value => formatDate(value),
            sorter: ((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            defaultSortOrder: "descend"
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
        let url = `${apiBackend}/api/v1/sells/getfilter/`;
        const userFilter = userSelect !== null ? 'userId=' + userSelect : "";

        let queryParams = [userFilter];
        const query = queryParams.filter(e => e !== '').join('&');
        url += query ? "?" + query : "";

        const response = await apiInstance.get(url, {
            withCredentials: false,
        });
        setSells(response.data.sells);
        setLoading(false);
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
        <div className="listSells">
            <Spin spinning={loading} indicator={customIndicator}>
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
                   : (
                    !loading && <Empty description="Nenhuma venda encontrada" />
                )}
            </Spin>
        </div>
    )
}

export default ListSellsSeller;
