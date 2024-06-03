import { Statistic } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "context/AuthProvider/useAuth";
import { formatCurrency, formatDateToBack } from "util/formatters";
import './index.css';
import { apiInstance } from "services/api";

const UserStats = ({ startDateProp, endDateProp }: { startDateProp: string, endDateProp: string }) => {
    const [userStats, setUserStats] = useState<Record<string, { totalSales: number }>[]>([]);
    const [totalSells, setTotalSells] = useState<number | undefined>(undefined);
    const [totalComission, setTotalComission] = useState<number | undefined>(undefined);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const today = new Date();
    const sellerId = useAuth().id;

    const setDates = useCallback(() => {
        const year = today.getFullYear();
        const month = today.getMonth();

        const targetMonth = month - 5;
        let targetYear = year;
        if (targetMonth < 0) {
            targetYear -= 1;
        }

        const adjustedMonth = (targetMonth + 12) % 12;
        const startDate = new Date(targetYear, adjustedMonth, 1);

        setStartDate(formatDateToBack(startDate));
        setEndDate(formatDateToBack(today));
    }, [today]);

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
        } catch (error) {
            console.error('Failed to fetch user stats:', error);
        }
    }, [sellerId, startDate, endDate]);

    useEffect(() => {
        setDates();
    }, [setDates]);

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
                <Statistic title='Total de Comissões' value={totalComission} formatter={(value) => formatCurrency(parseFloat(value.toString()))} />
            </div>
        </div>
    );
};

export default UserStats;
