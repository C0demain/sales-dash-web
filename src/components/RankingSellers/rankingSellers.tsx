import { useEffect, useState } from "react";
import { Empty, Table, Spin } from "antd";
import './index.css'
import { formatCurrency } from "util/formatters";
import { apiBackend, apiInstance } from "services/api";
import { getFirstAndLastName } from "util/getFirstAndLastName";

function RankingSellers() {
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const customIndicator = <div style={{ display: 'none' }} />;

    const columns = [
        {
            title: 'Nº',
            dataIndex: 'rankPosition',
            key: 'rankPosition'
        },
        {
            title: 'Vendedor',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => getFirstAndLastName(name)
        },
        {
            title: 'Valor Vendido',
            dataIndex: 'value',
            key: 'value',
            render: (value: number) => formatCurrency(value)
        },
    ];

    const getSellers = async () => {
        setLoading(true);
        const response = await apiInstance.get(`${apiBackend}/api/v1/dashboard/ranking`, {
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
            <Spin spinning={loading} indicator={customIndicator}>
                {sellers.length > 0 ? (
                    <>
                        <h3 style={{color: '#001529'}}>Ranking Dos Vendedores</h3>
                        <Table 
                            columns={columns} 
                            dataSource={sellers} 
                            rowKey="id" 
                            pagination={{ defaultPageSize: 5 }}
                        />
                    </>
                   ) : (
                    !loading && <Empty description="Nenhuma venda encontrada" />
                )}
            </Spin>
        </div>
    );
}

export default RankingSellers;
