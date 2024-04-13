import { Cascader } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";

type propsType = {
    controlState: any[],
    className?: string
}

const SelectClient = (props: propsType) =>{
    const [clientOpt, setClientOpt] = useState<any[]>([])
    const [controlState, setControlState] = props.controlState
    const { className } = props

    const getClients = async () => {
        const response = await axios.get("http://localhost:8000/api/v1/clients/getclients", {
            withCredentials: false,
        });

        const options = []
        for(let c of response.data.client){
            options.push({
                value: c.id,
                label: c.name
            })
        }

        setClientOpt(options)

    };

    useEffect(()=>{
        getClients()
    }, [])

    return (

        <>
            <Cascader
            options={clientOpt}
            onChange={e => {setControlState(e)} }
            placeholder="Escolha um cliente"
            multiple={false}
            className={className}
            showSearch
            />
        </>
    )
}


export default SelectClient