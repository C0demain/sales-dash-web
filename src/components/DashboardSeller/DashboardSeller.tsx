import ListSellsSeller from "components/ListSellSeller/ListSellSeller";
import './index.css'
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/AdminNavbar/AdminNavbar";
import TotalSellsSeller from "components/TotalSellsSeller/TotalSellsSeller";

function DashboardSeller () {
    return(
        <NavbarWrapper>
        <Navbargest/>
        <div className="container">
            <h1 className="tituloDashboard">Seu Dashboard</h1>
            <div className="box">
                <ListSellsSeller/>
            </div>
            <div className="box">
                <TotalSellsSeller/>
            </div>
        </div>
        </NavbarWrapper>
    )
}

export default DashboardSeller;