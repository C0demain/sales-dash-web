import React, { useCallback, useEffect, useState } from "react";
import { Statistic, Spin } from "antd";
import { useAuth } from "context/AuthProvider/useAuth";
import { formatCurrency } from "util/formatters";
import './index.css';
import { apiBackend, apiInstance } from "services/api";

const UserStatsSales = ({ startDateProp, endDateProp }: { startDateProp: string, endDateProp: string }) => {
    const [totalSells, setTotalSells] = useState<number | undefined>(undefined);
    const [totalComission, setTotalComission] = useState<number | undefined>(undefined);
    const [qtdeSells, setQtdeSells] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const customIndicator = <div style={{ display: 'none' }} />;
    const startDate = startDateProp;
    const endDate = endDateProp;
    const sellerId = useAuth().id;

    const getUserStats = useCallback(async () => {
        setLoading(true); // Start loading
        const url = `${apiBackend}/api/v1/dashboard/user/`;
        const userFilter = sellerId ? `id=${sellerId}` : '';
        const startDateFilter = startDate ? `startDate=${startDate}` : '';
        const endDateFilter = endDate ? `endDate=${endDate}` : '';

        const queryParams = [userFilter, startDateFilter, endDateFilter].filter(Boolean);
        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

        try {
            const response = await apiInstance.get(`${url}${queryString}`, { withCredentials: false });
            setTotalSells(response.data.userSales.totalValue);
            setTotalComission(response.data.userSales.totalCommissions);
            setQtdeSells(response.data.userSales.totalSales);
        } catch (error) {
            console.error('Failed to fetch user stats:', error);
        } finally {
            setLoading(false); // End loading
        }
    }, [sellerId, startDate, endDate]);

    useEffect(() => {
        if (startDate && endDate) {
            getUserStats();
        }
    }, [startDate, endDate, getUserStats]);

    return (
        <div className="containerStats">
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Spin indicator={customIndicator}/>
                </div>
            ) : (
                <>
                    <div className="boxStats">
                        <Statistic title='Total de vendas' value={totalSells} formatter={(value) => formatCurrency(parseFloat(value.toString()))} />
                    </div>
                    <div className="boxStats">
                        <Statistic title='Quantidade de vendas' value={qtdeSells} />
                    </div>
                    <div className="boxStats">
                        <Statistic title='Total de Comissões' value={totalComission} formatter={(value) => formatCurrency(parseFloat(value.toString()))} />
                    </div>
                </>
            )}
        </div>
    );
};

export { UserStatsSales };
