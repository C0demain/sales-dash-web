import axios from "axios";
import { useEffect, useState } from "react"
import './ListSells.css'
import { Empty, Table, Cascader } from "antd";

const ListSells = ()=>{
    const [sells, setSells] = useState<any[]>([])
    const [userOpt, setUserOpt] = useState<any[]>([])
    const [userSelect, setUserSelect] = useState<any>()
    const [productOpt, setProductOpt] = useState<any[]>([])
    const [productSelect, setProductSelect] = useState<any>()
    
    const columns = [
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Vendedor',
            dataIndex: 'seller',
            key: 'seller',
        },
        {
            title: 'Produto',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Cliente',
            dataIndex: 'clientname',
            key: 'clientname',
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
        },
    ]

    const getSells = async () => {
        let url = "http://localhost:8000/api/v1/sells/getall/filter"
        const userFilter = userSelect !== undefined ? 'userId=' + userSelect : ""
        const productFilter =  productSelect !== undefined ? 'productId=' + productSelect : ""
        
        const query = [userFilter, productFilter].join('&')
        url += query !== "&" ? "?" + query : ""


        const response = await axios.get(url, {
          withCredentials: false,
        });
        setSells(response.data.sells)
      };
    
    const getUsers = async () => {
    const response = await axios.get("http://localhost:8000/api/v1/auth/users", {
        withCredentials: false,
    });

    const options = []
    for(let u of response.data.users){
        options.push({
            value: u.id,
            label: u.name
        })
    }

    setUserOpt(options)

    };
    const getProduct = async () => {
    const response = await axios.get("http://localhost:8000/api/v1/products/getAll", {
        withCredentials: false,
    });

    const options = []
    for(let p of response.data.products){
        options.push({
            value: p.id,
            label: p.name
        })
    }

    setProductOpt(options)

    };

    useEffect(() => { 
        getUsers()
        getProduct()
        getSells()
        }, [])

    return (
        <div className="listSells">
            <h2>Últimas vendas</h2>
            <Cascader 
            options={userOpt}
            onChange={e => {setUserSelect(e)} }
            multiple={false}
            />
            <Cascader 
            options={productOpt}
            onChange={e => {setProductSelect(e)} }
            multiple={false}
            />
            <button onClick={e => {getSells()} } >Filtrar</button>
            {sells.length > 0 ?
            <Table columns={columns} dataSource={sells} />
            : <Empty description={"Nenhuma venda encontrada"} />}
        </div>
    )
}

export default ListSells
