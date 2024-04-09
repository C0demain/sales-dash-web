import axios from "axios";
import { useEffect, useState } from "react"
import './ListSells.css'

const ListSells = ()=>{
    const [sells, setSells] = useState<any[]>([])

    const getSells = async () => {
        const response = await axios.get("http://localhost:8000/api/v1/sells/getall", {
          withCredentials: false,
        });
        setSells(response.data.sells)
      };

    useEffect(() => { 
        getSells()
        }, [])

    return (
        <div className="listSells">
            <h1>Últimas vendas</h1>
            {sells.length > 0 ?
            <table className="listSellsGroup">
                <tr>
                    <th>Data</th>
                    <th>Vendedor</th>
                    <th>Produto</th>
                    <th>Cliente</th>
                    <th>Departamento</th>
                    <th>Valor</th>
                </tr>
                {sells.map(sell => (
                <tr className="sellItem" key={sell.id}>
                    <td>{sell.date}</td>
                    <td>{sell.seller}</td>
                    <td>{sell.product}</td>
                    <td>{sell.client}</td>
                    <td>{sell.client_department}</td>
                    <td>R$ {sell.value}</td>
                </tr>
                ))}
            </table>
            : <p>Nenhuma venda disponível</p>}
        </div>
    )
}

export default ListSells
