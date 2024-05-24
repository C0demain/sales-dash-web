import axios from "axios";
import { Statistic } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "context/AuthProvider/useAuth";
import { formatCurrency, formatDateToBack } from "util/formatters";
import './index.css'

const UserStats = ({ startDateProp, endDateProp }: { startDateProp: string, endDateProp: string }) => {
    const [userStats, setUserStats] = useState <Record<string, {totalSales: number}>[]>([])
    const [totalSells, setTotalSells] = useState <any>()
    const [totalComission, setTotalComission] = useState<any>()
    const [startDate, setStartDate] = useState<any>()
    const [endDate, setEndDate] = useState<any>()
    const today = new Date
    const sellerId = useAuth().id

    const setDates = useCallback(async()=>{
        const year = today.getFullYear();
        const month = today.getMonth();
    
        // Calcular o mês do 5º mês passado
        const targetMonth = month - 5;
    
        // Verificar se precisa ajustar o ano
        let targetYear = year;
        if (targetMonth < 0) {
            targetYear -= 1;
        }
    
        // Obter o mês ajustado dentro do intervalo [0, 11]
        const adjustedMonth = (targetMonth + 12) % 12;
    
        // Retornar o primeiro dia do mês desejado
        let startDate = new Date(targetYear, adjustedMonth, 1);
    
        setStartDate(formatDateToBack (startDate))
        setEndDate(formatDateToBack (today))
        getUserStats()
      },[today])

    const getUserStats = useCallback(async() => {
        console.log(startDate)
        console.log(endDate)
        let url = `http://localhost:8000/api/v1/dashboard/user/`
        const userFilter = sellerId !== undefined ? 'id=' + sellerId : ""
        const startDateFilter = startDate ? 'startDate=' + startDate: ""
        const endDateFilter = endDate ? 'endDate=' + endDate: ""

        let queryParams = [userFilter, startDateFilter, endDateFilter]
        const query = queryParams.filter(e => e !== '').join('&')
        url += query !== "&" ? "?" + query : ""
    
        const response = await axios.get(url, {
          withCredentials: false,
        },);
        setTotalSells(response.data.userSales.totalValue)
        setTotalComission(response.data.userSales.totalCommissions)
    }, [startDate, endDate])

    useEffect(()=>{
        setDates()
    }, [setDates])

    return (
        <div className="containerStats">
            <div className="boxStats">
                <Statistic title='Total de vendas' value={totalSells} formatter={ (value) => formatCurrency(parseFloat(value.toString())) }/>
            </div>
            <div className="boxStats">
            <Statistic title='Total de Comissões' value={totalComission} formatter={ (value) => formatCurrency(parseFloat(value.toString())) }/>
            </div>
        </div>
    )
}

export default UserStats