import './index.css'
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import RankingSellers from "components/RankingSellers/rankingSellers";
import BasicLineChart from "components/LineChart/LineChart";
import BarChart from "components/Barchart/BarChart";
import Navbar from "components/Navbar/Navbar";
import ProductChart from "components/ProductChart/ProductChart";
import { useCallback, useEffect, useState } from "react";
import { Empty } from 'antd';
import { apiInstance } from 'services/api';

function DashboardAdmin() {
    const [startDate, setStartDate] = useState<any>()
    const [endDate, setEndDate] = useState<any>()
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
            <div className="containerDash">
                <div><h1 className="tituloDashboard">Dashboard Gestor</h1></div>
                {totalQtde > 0 ? (<div style={{display: 'flex', flexDirection: 'row'}}>
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
                </div>) : (<div style={{display: 'flex', alignItems: 'center', height: '100%'}}><Empty description='Não há vendas cadastradas'/></div>)
                }
                
            </div>
        </NavbarWrapper>
    )
}

export default DashboardAdmin;
