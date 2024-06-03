import { useEffect, useState } from "react";
import { Empty, Table, Button, Spin } from "antd";
import './index.css'
import { formatCurrency } from "util/formatters";
import { apiInstance } from "services/api";

function RankingSellers() {
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        {
            title: 'Posição',
            dataIndex: 'rankPosition',
            key: 'rankPosition'
        },
        {
            title: 'Vendedor',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Valor total de vendas',
            dataIndex: 'value',
            key: 'value',
            render: (value: number) => formatCurrency(value)
        },
        {
            title: 'Quantidade de vendas',
            dataIndex: 'productsSold',
            key: 'productsSold'
        },

    ];

    const getSellers = async () => {
        setLoading(true);
        const response = await apiInstance.get(`http://localhost:8000/api/v1/dashboard/ranking`, {
            withCredentials: false,
        });

        const ranking = response.data.ranking.map((e: any, k: number) => ({ ...e, rankPosition: k + 1 }));

        setSellers(ranking);
        setLoading(false);
    };

    useEffect(() => {
        getSellers();
    }, []);

    return (
        <div className="ranking">
            <Spin spinning={loading}>
                {sellers.length > 0 ?
                    <>
                        <h2>Ranking de vendedores por valor</h2>
                        <Button type="primary" className="custom-button-refresh" onClick={getSellers}>Recarregar Ranking</Button>
                        <Table 
                            columns={columns} 
                            dataSource={sellers} 
                            rowKey="id" 
                            pagination={{ defaultPageSize: 10 }}
                        />
                    </>
                    : <Empty description={"Nenhuma venda encontrada"} />}
            </Spin>
        </div>
    );
}

export default RankingSellers;
