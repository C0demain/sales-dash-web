import React, { useCallback, useEffect, useState } from 'react';
import './index.css';
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import BasicLineChart from 'components/LineChart/LineChart';
import Navbar from 'components/Navbar/Navbar';
import ProductChart from 'components/ProductChart/ProductChart';
import ClientSalesChart from 'components/ClientSalesChart/ClientSalesChart';
import { apiBackend, apiInstance } from 'services/api';
import BarChart from 'components/Barchart/BarChart';
import RankingSellers from 'components/RankingSellers/rankingSellers';
import { Empty, Spin } from 'antd';
import FilterDash from 'components/FilterDash/FilterDash';

const DashboardAdmin: React.FC = () => {
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [totalQtde, setTotalQtde] = useState<any>();
  const [checked, setChecked] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chartsLoaded, setChartsLoaded] = useState<boolean>(false); // Novo estado para controlar a renderização dos gráficos
  const customIndicator = <div style={{ display: 'none' }} />;

  const fetchSells = useCallback(async () => {
    try {
      const response = await apiInstance.get(`${apiBackend}/api/v1/sells/getall`, {
        withCredentials: false,
      });
      setTotalQtde(response.data.sell.length);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching sells:', error);
      setIsLoading(false);
    }
  }, []);

  const loadCharts = useCallback(async () => {
    try {
      // Simulando carregamento dos gráficos
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simule o tempo de carregamento dos gráficos
      setChartsLoaded(true); // Marca os gráficos como carregados
    } catch (error) {
      console.error('Error loading charts:', error);
      setChartsLoaded(true); // Marca os gráficos como carregados mesmo em caso de erro
    }
  }, []);

  useEffect(() => {
    fetchSells();
  }, [fetchSells]);

  useEffect(() => {
    if (!isLoading && totalQtde > 0) {
      loadCharts();
    }
  }, [isLoading, totalQtde, loadCharts]);

  return (
    <NavbarWrapper>
      <Navbar />
      {isLoading ? (
        <div className="spinner-container">
          <Spin size="large" />
        </div>
      ) : totalQtde > 0 ? (
        <div className="dashboard-container">
          <h1 className="dashboard-title">Dashboard Gestor</h1>
          <div className='filter-box'>
            <FilterDash
              onEndDateChange={setEndDate}
              onStartDateChange={setStartDate}
              onCheckedChange={setChecked}
            />
          </div>
          <div className="charts-grid">
            {chartsLoaded ? (
              <>
                <div className="chart-box">
                  <BasicLineChart
                    endDateProp={endDate}
                    startDateProp={startDate}
                    checkedProp={checked}  
                  />
                </div>
                <div className="chart-box">
                  <BarChart />
                </div>
                <div className="chart-box">
                  <ProductChart 
                    checkedProp={checked} 
                    startDateProp={startDate} 
                    endDateProp={endDate} 
                  />
                </div>
                <div className="chart-box">
                  <ClientSalesChart 
                    startDateProp={startDate} 
                    endDateProp={endDate} 
                  />
                </div>
              </>
            ) : (
              <div className="spinner-container">
                <Spin indicator={customIndicator} />
              </div>
            )}
          </div>
          <div className="ranking-sellers">
            <RankingSellers />
          </div>
        </div>
      ) : null}

      {!isLoading && totalQtde === 0 && (
        <div className="empty-container">
          <Empty description='Não há vendas cadastradas' />
        </div>
      )}
    </NavbarWrapper>
  );
};

export default DashboardAdmin;
