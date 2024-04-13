import { Cascader } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";

type propsType = {
    controlState: any[],
    className?: string
}

const SelectProduct = (props: propsType) =>{
    const [productOpt, setProductOpt] = useState<any[]>([])
    const [controlState, setControlState] = props.controlState
    const { className } = props

    const getProducts = async () => {
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
            multiple={false}
            className={className}
            showSearch
            />
        </>
    )
}


export default SelectProduct