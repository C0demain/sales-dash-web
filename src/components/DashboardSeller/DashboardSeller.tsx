import ListSellsSeller from "components/ListSellSeller/ListSellSeller";
import './index.css'
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import {UserStatsSales} from "components/UserStats/UserStatsSales";
import { useState, useEffect } from "react";
import LineChartSeller from "components/LineChartSeller/LineChartSeller";
import Navbar from "components/Navbar/Navbar";
import CommissionChartSeller from "components/CommissionChartSeller/CommissionChartSeller";
import { UserStatsCommission } from "components/UserStats/UserStatsCommission";

function DashboardSeller() {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [startDateStats, setStartDateStats] = useState<string>("");
    const [endDateStats, setEndDateStats] = useState<string>("");
    const [totalCommission,setTotalCommission] = useState<any>()

    return (
        <NavbarWrapper>
            <Navbar />
            <div className="containerDash">
                <div><h1 className="tituloDashboard">Dashboard Vendedor</h1></div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div className="chartsBoxSeller">
                        <LineChartSeller 
                        onStartDateChange={setStartDateStats}
                        onEndDateChange={setEndDateStats}/>
                        <UserStatsSales
                        startDateProp={startDateStats}
                        endDateProp={endDateStats}/>
                    </div>
                    <div className="chartsBoxSeller">
                        <CommissionChartSeller
                        onTotalCommissionChange={setTotalCommission} />
                        <UserStatsCommission
                        totalComissionProp={totalCommission}/>
                    </div>
                </div>
                <div className="box">
                    <ListSellsSeller
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate} />
                </div>
            </div>
        </NavbarWrapper>
    )
}

export default DashboardSeller;