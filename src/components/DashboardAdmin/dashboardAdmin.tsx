import ListSells from "components/ListSell/ListSells";
import './index.css'
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import RankingSellers from "components/RankingSellers/rankingSellers";
import BasicLineChart from "components/LineChart/LineChart";
import BarChart from "components/Barchart/BarChart";
import Navbar from "components/Navbar/Navbar";
import ProductChart from "components/ProductChart/ProductChart";
import { useState } from "react";

function DashboardAdmin() {
    const [startDate, setStartDate] = useState<any>()
    const [endDate, setEndDate] = useState<any>()
    return (
        <NavbarWrapper>
            <Navbar />
            <div className="containerDash">
                <div><h1 className="tituloDashboard">Dashboard Gestor</h1></div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div style={{display: 'flex', flexDirection: 'column', marginRight: '2vh'}}>
                        <div className="chartsBox">
                            <BasicLineChart
                            onEndDateChange={setEndDate}
                            onStartDateChange={setStartDate}
                            />
                            <BarChart />
                        </div>
                        <div className="chartsBox">
                            <ProductChart
                            startDateProp={startDate}
                            endDateProp={endDate}/>    
                        </div>
                    </div>
                    <div>
                        <RankingSellers/>
                    </div>
                </div>
            </div>
        </NavbarWrapper>
    )
}

export default DashboardAdmin;
