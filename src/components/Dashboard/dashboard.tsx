import ListSells from "components/ListSell/ListSells";
import './index.css'
import Navbargest from "components/AdminNavbar/AdminNavbar";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import RankingSellers from "components/RankingSellers/rankingSellers";
import TotalSellsSeller from "components/TotalSellsSeller/TotalSellsSeller";

function Dashboard() {
    return(
        <NavbarWrapper>
        <Navbargest/>
        <div className="container">
            <h1 className="tituloDashboard">Dashboard Geral</h1>
            <div className="box">
                <ListSells/>
            </div>
            <div className="divider"></div>
            <div className="box">
                <RankingSellers/>
            </div>
        </div>
        </NavbarWrapper>
    )
}

export default Dashboard;
