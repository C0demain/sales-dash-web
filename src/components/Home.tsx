import { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import './Home.css'

class Home extends Component{
    render(): ReactNode {
        return (
            <div className="home">
                <h1>Bem vindo ao Sales dash</h1>
                <Link to='/exemplo'>Clique aqui para ver uma página de exemplo</Link>
            </div>
        )
    }
}

export default Home