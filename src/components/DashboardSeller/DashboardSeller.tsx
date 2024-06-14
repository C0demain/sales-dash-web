import ListSellsSeller from "components/ListSellSeller/ListSellSeller";
import './index.css'
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import {UserStatsSales} from "components/UserStats/UserStatsSales";
import { useState, useEffect, useCallback } from "react";
import LineChartSeller from "components/LineChartSeller/LineChartSeller";
import Navbar from "components/Navbar/Navbar";
import CommissionChartSeller from "components/CommissionChartSeller/CommissionChartSeller";
import { UserStatsCommission } from "components/UserStats/UserStatsCommission";
import { apiInstance } from "services/api";
import { Empty } from "antd";
import ProductChart from "components/ProductChart/ProductChart";

function DashboardSeller() {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [startDateStats, setStartDateStats] = useState<string>("");
    const [endDateStats, setEndDateStats] = useState<string>("");
    const [totalCommission,setTotalCommission] = useState<any>()
    const [totalQtde, setTotalQtde] = useState<any>()
    
    const getSells = useCallback(async() => {
        let url = 'http://localhost:8000/api/v1/sells/getall'

        const response = await apiInstance.get(url, {
            withCredentials: false,
          });
        setTotalQtde(response.data.sell.length)
    }, [])
    useEffect(()=>{
        getSells()
    }, [])

    return (
        <NavbarWrapper>
            <Navbar />
            {totalQtde>0?(<div className="dashboard-container">
                <div><h1 className="dashboard-title">Dashboard Vendedor</h1></div>
                <div className="charts-gridd">
                    <div className="chart-box">
                        <LineChartSeller onEndDateChange={setEndDate} onStartDateChange={setStartDate} />
                        <UserStatsSales
                            startDateProp={startDateStats}
                            endDateProp={endDateStats}/>
                    </div>            
                    <div className="chart-box">
                        <CommissionChartSeller
                        onTotalCommissionChange={setTotalCommission} />
                        <UserStatsCommission
                        totalComissionProp={totalCommission}/>
                    </div>
                    <div className="chart-box">
                        <ProductChart startDateProp={startDate} endDateProp={endDate} />
                    </div>
                </div>
                <div className="ranking-sellers">
                    <ListSellsSeller
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate} />
                </div>
            </div>):(<div style={{display: 'flex', alignItems: 'center', height: '100%'}}><Empty description='Não há vendas cadastradas'/></div>)}
            
        </NavbarWrapper>
    )
}

export default DashboardSeller;