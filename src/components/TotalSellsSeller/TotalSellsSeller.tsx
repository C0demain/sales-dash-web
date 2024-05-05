import axios from "axios";
import { Statistic } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "context/AuthProvider/useAuth";

const TotalSellsSeller = () => {
    const [userStats, setUserStats] = useState <Record<string, {totalSales: number}>[]>([])
    const [totalSells, setTotalSells] = useState <any>()
    const [totalComission, setTotalComission] = useState<any>()
    const [startDate, setStartDate] = useState<any>()
    const [endDate, setEndDate] = useState<any>()
    const date = new Date
    const sellerId = useAuth().id

    const getUserStats = useCallback(async() => {
        let url = `http://localhost:8000/api/v1/dashboard/user/`
        const userFilter = sellerId !== undefined ? sellerId : ""
        const startDateFilter = startDate ? 'startDate=' + startDate: ""
        const endDateFilter = endDate ? 'endDate=' + endDate: ""

        let queryParams = [userFilter]
        const query = queryParams.filter(e => e !== '').join('&')
        url += query !== "&" ? "" + query : ""
    
        const response = await axios.get(url, {
          withCredentials: false,
        },);
        setUserStats(response.data.userSales)
        setTotalSells(response.data.userSales.totalSales)
        console.log(totalSells)
    }, [sellerId])

    useEffect(()=>{
        getUserStats()

    }, [getUserStats])

    return (
        <Statistic title='Total de vendas' value={totalSells}/>
    )
}

export default TotalSellsSeller