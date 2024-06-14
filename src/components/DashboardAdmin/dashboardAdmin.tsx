import React, { useCallback, useEffect, useState } from 'react';
import './index.css'
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import BasicLineChart from 'components/LineChart/LineChart';
import Navbar from 'components/Navbar/Navbar';
import ProductChart from 'components/ProductChart/ProductChart';
import ClientSalesChart from 'components/ClientSalesChart/ClientSalesChart';
import { apiInstance } from 'services/api';
import BarChart from 'components/Barchart/BarChart';
import RankingSellers from 'components/RankingSellers/RankingSellers';

const DashboardAdmin: React.FC = () => {
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [totalQtde, setTotalQtde] = useState<any>();

  const fetchSells = useCallback(async () => {
    try {
      const response = await apiInstance.get('http://localhost:8000/api/v1/sells/getall', {
        withCredentials: false,
      });
      setTotalQtde(response.data.sell.length);
    } catch (error) {
      console.error('Error fetching sells:', error);
    }
  }, []);

  useEffect(() => {
    fetchSells();
  }, []);

  return (
    <NavbarWrapper>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard Gestor</h1>
        <div className="charts-grid">
          <div className="chart-box">
            <BasicLineChart onEndDateChange={setEndDate} onStartDateChange={setStartDate} />
          </div>
          <div className="chart-box">
            <BarChart />
          </div>
          <div className="chart-box">
            <ProductChart startDateProp={startDate} endDateProp={endDate} />
          </div>
          <div className="chart-box">
            <ClientSalesChart />
          </div>
        </div>
        <div className="ranking-sellers">
          <RankingSellers />
        </div>
      </div>
    </NavbarWrapper>
  );
};

export default DashboardAdmin;
