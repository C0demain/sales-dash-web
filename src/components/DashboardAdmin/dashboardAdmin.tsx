import ListSells from "components/ListSell/ListSells";
import './index.css'
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import RankingSellers from "components/RankingSellers/rankingSellers";
import BasicLineChart from "components/LineChart/LineChart";
import BarChart from "components/Barchart/BarChart";
import Navbar from "components/Navbar/Navbar";
import ProductChart from "components/ProductChart/ProductChart";

function DashboardAdmin() {
    return (
        <NavbarWrapper>
            <Navbar />
            <div className="containerDash">
                <div><h1 className="tituloDashboard">Dashboard Gestor</h1></div>
                <div className="chartsBox">
                    <BasicLineChart/>
                    <BarChart />
                </div>
                <div className="box"></div>
                <div className="chartsBox">
                    <ProductChart/>    
                </div>
                <div className="box"></div>
                <div className="chartsBox">
                    <ListSells/>
                    <RankingSellers/>
                </div>
                <div className="divider"></div>
            </div>
        </NavbarWrapper>
    )
}

export default DashboardAdmin;
