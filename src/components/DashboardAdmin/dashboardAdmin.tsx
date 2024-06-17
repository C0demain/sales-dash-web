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
  const [checked, setChecked] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado para controlar o carregamento


  const fetchSells = useCallback(async () => {
    try {
      const response = await apiInstance.get(`${apiBackend}/api/v1/sells/getall`, {
        withCredentials: false,
      });
      setTotalQtde(response.data.sell.length);
      setIsLoading(false); // Marca o fim do carregamento apenas se os dados foram carregados com sucesso
    } catch (error) {
      console.error('Error fetching sells:', error);
      setIsLoading(false); // Marca o fim do carregamento em caso de erro também
    }
  }, []);

  useEffect(() => {
    fetchSells();
  }, []);

  return (
    <NavbarWrapper>
      <Navbar />
      {isLoading ? ( // Se estiver carregando, mostra o spinner centralizado na tela
        <div className="spinner-container">
          <Spin size="large" />
        </div>
      ) : totalQtde > 0 ? ( // Se houver vendas, mostra os componentes do dashboard
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
          </div>
          <div className="ranking-sellers">
            <RankingSellers />
          </div>
        </div>
      ) : null} {/* Não renderiza nada se não houver vendas, aguardando os dados */}

      {!isLoading && totalQtde === 0 && ( // Se o carregamento terminou e não há vendas, mostra o Empty
        <div className="empty-container">
          <Empty description='Não há vendas cadastradas' />
        </div>
      )}

    </NavbarWrapper>
  );
};

export default DashboardAdmin;
