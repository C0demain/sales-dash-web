import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const CommissionsChart: React.FC = () => {
  const [comissoes, setComissoes] = useState<any>(null);
  const [mes, setMes] = useState<string>('');

  useEffect(() => {
    const fetchComissoes = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/commissions/getAll');
        const data = await response.json();
        setComissoes(data);
        if (data && Object.keys(data).length > 0) {
          setMes(Object.keys(data)[0]);
        }
      } catch (error) {
        console.error('Erro ao buscar comissões:', error);
      }
    };

    fetchComissoes();
  }, []);

  useEffect(() => {
    if (!comissoes) return;

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(comissoes),
        datasets: [{
          label: 'Comissões',
          data: Object.values(comissoes),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, [comissoes]);

  const handleChangeMonth = (newMonth: string) => {
    setMes(newMonth);
  };

  return (
    <div>
      <div>
        {Object.keys(comissoes || {}).map((month, index) => (
          <button key={index} onClick={() => handleChangeMonth(month)}>
            {month}
          </button>
        ))}
      </div>
      <canvas id="myChart" width="400" height="400"></canvas>
    </div>
  );
};

export default CommissionsChart;

