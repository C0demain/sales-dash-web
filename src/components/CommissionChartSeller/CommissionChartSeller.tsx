import { InputNumber, Select } from "antd"
import { useAuth } from "context/AuthProvider/useAuth";
import { useState, useEffect } from "react"
import { Chart } from 'react-google-charts'
import { apiInstance } from "services/api"

interface CommissionChartSellerProps{
  onTotalCommissionChange: (date: number) => void
}

export default function CommissionChartSeller({onTotalCommissionChange}: CommissionChartSellerProps){
    const [commissions, setCommissions] = useState<any>([]);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
    const user = useAuth().id;
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];   

    const getStats = async () => {
        try{
            const url = 'http://localhost:8000/api/v1/dashboard/date/commission'
            const userId = user ? `${user}` : '';
            const startDate = `${selectedYear}-01-01`
            const endDate = `${selectedYear}-12-31`
            
            const response = await apiInstance.get(url, {params: {userId, startDate, endDate} })
            const chartData: any[] = [];
            chartData.push(['', 'Valor', { role: 'style' }])
            const currentMonth = response.data.stats.find((e: any) => e.month == months[selectedMonthIndex])
            if(currentMonth){
                let soma = 0
                currentMonth.commissionValues.forEach((value: any) => {
                soma += value.totalValue
                chartData.push([value.title.replace('/', '\n'), value.totalValue, getRandomColor(selectedMonthIndex)])
                })
                onTotalCommissionChange(soma)
            }else{
                chartData.push(["Cliente novo\n Produto novo", 0, getRandomColor(selectedMonthIndex)])
                chartData.push(["Cliente novo\n Produto velho", 0, getRandomColor(selectedMonthIndex)])
                chartData.push(["Cliente velho\n Produto novo", 0, getRandomColor(selectedMonthIndex)])
                chartData.push(["Cliente velho\n Produto velho", 0, getRandomColor(selectedMonthIndex)])
            }
            setCommissions(chartData);
            
        }catch(error){
            console.error('Erro ao buscar os dados das comissões:', error);
        }
      }
    
      useEffect(() => {
        getStats()
      }, [selectedMonthIndex, selectedYear]);
    
      const getRandomColor = (index: number) => {
        const colors = ['#FF5733', '#5733FF', '#FF33DD', '#33DDFF']; 
        return colors[index % colors.length];
      };
    
      return (
        <div className='charts' style={{marginBottom: '1vh'}}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '3vh', minWidth: '100%' }}>
            
            <Select
            style={ {minWidth: '30%'} }
            placeholder="Escolha um mês"
            defaultValue={selectedMonthIndex}
            onChange={(value: number) => {setSelectedMonthIndex(value)}}
            options={months.map((month: string, index: number) => {return {label: month, value: index} })}
            />
            <InputNumber
            min={1970}
            max={new Date().getFullYear()}
            defaultValue={selectedYear}
            onChange={(value: number | null) => {setSelectedYear(value || new Date().getFullYear())}}
            style={ {height: 'min-content', width: 'fit-content'} }
            />
          </div>
          <div style={{ display: 'flex', maxWidth: 600 }}>
            <Chart
              width="50vh"
              height="35vh"
              chartType="Bar"
              loader={<div>Carregando Gráfico</div>}
              data={commissions}
              options={{
                chart: {
                  title: `Comissões Mensais - ${months[selectedMonthIndex]}`,
                },
                legend: { position: 'none' },
                animation: {
                  duration: 3000,
                  easing: "linear",
                  startup: true,
                }
              }}
            />
          </div>
        </div>
    )
}