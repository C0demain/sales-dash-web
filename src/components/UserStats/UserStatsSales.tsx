import { Statistic } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "context/AuthProvider/useAuth";
import { formatCurrency, formatDateToBack } from "util/formatters";
import './index.css';
import { apiInstance } from "services/api";

const UserStatsSales = ({ startDateProp, endDateProp }: { startDateProp: string, endDateProp: string }) => {
    const [totalSells, setTotalSells] = useState<number | undefined>(undefined);
    const [totalComission, setTotalComission] = useState<number | undefined>(undefined);
    const [qtdeSells, setQtdeSells] = useState<number | undefined>(undefined);
    const startDate = startDateProp
    const endDate = endDateProp
    const sellerId = useAuth().id;

    const getUserStats = useCallback(async () => {
        const url = `http://localhost:8000/api/v1/dashboard/user/`;
        const userFilter = sellerId ? `id=${sellerId}` : '';
        const startDateFilter = startDate ? `startDate=${startDate}` : '';
        const endDateFilter = endDate ? `endDate=${endDate}` : '';

        const queryParams = [userFilter, startDateFilter, endDateFilter].filter(Boolean);
        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

        try {
            const response = await apiInstance.get(`${url}${queryString}`, { withCredentials: false });
            setTotalSells(response.data.userSales.totalValue);
            setTotalComission(response.data.userSales.totalCommissions);
            setQtdeSells(response.data.userSales.totalSales)
            console.log(response.data.userSales)
        } catch (error) {
            console.error('Failed to fetch user stats:', error);
        }
    }, [sellerId, startDate, endDate]);

    useEffect(() => {
        if (startDate && endDate) {
            getUserStats();
        }
    }, [startDate, endDate, getUserStats]);

    return (
        <div className="containerStats">
            <div className="boxStats">
                <Statistic title='Total de vendas' value={totalSells} formatter={(value) => formatCurrency(parseFloat(value.toString()))} />
            </div>
            <div className="boxStats">
                <Statistic title='Quantidade de vendas' value={qtdeSells}/>
            </div>
            <div className="boxStats">
                <Statistic title='Total de Comissões' value={totalComission} formatter={(value) => formatCurrency(parseFloat(value.toString()))} />
            </div>
        </div>
    );
};

export {UserStatsSales};
