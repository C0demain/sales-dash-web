import { Cascader } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";

type propsType = {
    controlState: any[],
    className?: string
}

const SelectSeller = (props: propsType) =>{
    const [userOpt, setUserOpt] = useState<any[]>([])
    const [controlState, setControlState] = props.controlState
    const { className } = props

    const getSellers = async () => {
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

    useEffect(()=>{
        getSellers()
    }, [])

    return (
        <>
            <Cascader
            options={userOpt}
            onChange={e => {setControlState(e)} }
            placeholder="Escolha um vendedor"
            multiple={false}
            className={className}
            showSearch
            />
        </>
    )
}


export default SelectSeller