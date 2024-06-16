import React, { useState, useEffect, useCallback } from 'react';
import { Spin, Empty } from 'antd';
import './index.css';
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import Navbar from 'components/Navbar/Navbar';
import ListSellsSeller from 'components/ListSellSeller/ListSellSeller';
import LineChartSeller from 'components/LineChartSeller/LineChartSeller';
import CommissionChartSeller from 'components/CommissionChartSeller/CommissionChartSeller';
import ProductChart from 'components/ProductChart/ProductChart';
import { UserStatsSales } from 'components/UserStats/UserStatsSales';
import { UserStatsCommission } from 'components/UserStats/UserStatsCommission';
import { apiBackend, apiInstance } from 'services/api';

function DashboardSeller() {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [startDateStats, setStartDateStats] = useState<string>('');
    const [endDateStats, setEndDateStats] = useState<string>('');
    const [totalCommission, setTotalCommission] = useState<any>();
    const [totalQtde, setTotalQtde] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);

    const getSells = useCallback(async () => {
        try {
            const response = await apiInstance.get(`${apiBackend}/api/v1/sells/getall`, {
                withCredentials: false,
            });
            setTotalQtde(response.data.sell.length);
        } catch (error) {
            console.error('Error fetching sells:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getSells();
    }, [getSells]);

    return (
        <NavbarWrapper>
            <Navbar />
            {loading ? (
                <div className="spinner-container">
                    <Spin size="large" />
                </div>
            ) : totalQtde > 0 ? (
                <div className="dashboard-container">
                    <h1 className="dashboard-title">Dashboard Vendedor</h1>
                    <div className="charts-grid">
                        <div className="chart-box">
                            <LineChartSeller
                                onStartDateChange={setStartDateStats}
                                onEndDateChange={setEndDateStats}
                            />
                            <UserStatsSales
                                startDateProp={startDateStats}
                                endDateProp={endDateStats}
                            />
                        </div>
                        <div className="chart-box">
                            <CommissionChartSeller
                                onTotalCommissionChange={setTotalCommission}
                            />
                            <UserStatsCommission
                                totalComissionProp={totalCommission}
                            />
                        </div>
                        <div className="list-sells-box">
                            <ListSellsSeller
                                onStartDateChange={setStartDate}
                                onEndDateChange={setEndDate}
                            />
                        </div>
                        <div className="chart-box">
                            <ProductChart
                                startDateProp={startDateStats}
                                endDateProp={endDateStats}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="spinner-container">
                    <Empty description="Não há vendas cadastradas" />
                </div>
            )}
        </NavbarWrapper>
    );
}

export default DashboardSeller;
