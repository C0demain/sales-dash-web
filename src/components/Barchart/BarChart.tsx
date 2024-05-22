import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';

export default function BarChart() {
  const [commissions, setCommissions] = useState<any>([]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0);
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']; 

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/commissions/getAll')
      .then(response => response.json())
      .then(data => {
        const chartData = [['Comissão', 'Valor', { role: 'style' }]];
        data[selectedMonthIndex]?.commissions.forEach((commission: any, index: number) => {
          const color = getRandomColor(index);
          chartData.push([commission.name, commission.value, color]);
        });
        setCommissions(chartData);
      })
      .catch(error => {
        console.error('Erro ao buscar os dados das comissões:', error);
      });
  }, [selectedMonthIndex]);

  const handleNextMonth = () => {
    setSelectedMonthIndex((prevIndex) => (prevIndex + 1) % months.length);
  };

  // Função para gerar cores aleatórias
  const getRandomColor = (index: number) => {
    const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF33DD', '#33DDFF']; 
    return colors[index % colors.length];
  };

  return (
    <div style={{margin: '5vh'}}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5vh' }}>
        <button onClick={handleNextMonth}>Próximo Mês</button>
      </div>
      <div style={{ display: 'flex', maxWidth: 600 }}>
        <Chart
          width="75vh"
          height="35vh"
          chartType="Bar"
          loader={<div>Carregando Gráfico</div>}
          data={commissions}
          options={{
            chart: {
              title: `Comissões Mensais - ${months[selectedMonthIndex]}`,
            },
            legend: { position: 'none' },
          }}
        />
      </div>
    </div>
  );
}