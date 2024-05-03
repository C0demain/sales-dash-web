import { Cascader } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";

type propsType = {
    controlState: any[],
    dataKey: string,
    className?: string
}

const SelectProduct = (props: propsType) =>{
    const [productOpt, setProductOpt] = useState<any[]>([])
    const [controlState, setControlState] = props.controlState
    const { dataKey, className } = props

    const getProducts = async () => {
        const response = await axios.get("http://localhost:8000/api/v1/products/getAll", {
            withCredentials: false,
        });
    
        const options = []
        for(let p of response.data.products){
            options.push({
                value: p[dataKey],
                label: p.name
            })
        }
    
        setProductOpt(options)
    }

    useEffect(()=>{
        getProducts()
    }, [])

    return (

        <>
            <Cascader
            options={productOpt}
            onChange={e => {setControlState(e)} }
            placeholder="Escolha um produto"
            style={{
                width: '100%',
                height: '5vh',
                borderRadius: '1vh',
                backgroundColor: 'white',
                borderColor: 'black'
            }}
            showSearch
            value={controlState}
            />
        </>
    )
}


export default SelectProduct