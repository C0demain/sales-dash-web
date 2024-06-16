import { useCallback, useEffect, useState } from "react";
import Switch from '@mui/material/Switch';
import { Select } from "antd";
import { Stack } from "@mui/material";
import { formatDateToBack } from "util/formatters";
import { useAuth } from "context/AuthProvider/useAuth";

interface FilterDashProps {
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    onCheckedChange: (checked: boolean) => void
  }
  
export default function FilterDash({ onStartDateChange, onEndDateChange, onCheckedChange }: FilterDashProps){
    const today = new Date()
    const role = useAuth().role
    const [checked, setChecked] = useState<boolean>(true)
    const [title, setTitle] = useState<string>("Valor")
    const [periodOptions, setPeriodOptions] = useState<any>([
      {
        label: 'Últimos 12 meses',
        value: 11
      },
      {
        label: 'Últimos 6 meses',
        value: 5
      },
      {
        label: 'Últimos 3 meses',
        value: 2
      },
    ])

    const periodOptionsAdmin = [
        {
          label: 'Últimos 12 meses',
          value: 11
        },
        {
          label: 'Últimos 6 meses',
          value: 5
        },
        {
          label: 'Últimos 3 meses',
          value: 2
        },
      ]
    const periodOptionsUser = [
        {
          label: 'Últimos 12 meses',
          value: 11
        },
        {
          label: 'Últimos 6 meses',
          value: 5
        },
        {
          label: 'Últimos 3 meses',
          value: 2
        },
        {
          label: 'Mês atual',
          value: 0
        },
      ]

      const setDates = useCallback(async (value: number) => {
        const year = today.getFullYear();
        const month = today.getMonth();
    
        // Calcular o mês do 5º mês passado
        const targetMonth = month - value;
    
        // Verificar se precisa ajustar o ano
        let targetYear = year;
        if (targetMonth < 0) {
          targetYear -= 1;
        }
    
        // Obter o mês ajustado dentro do intervalo [0, 11]
        const adjustedMonth = (targetMonth + 12) % 12;
    
        // Retornar o primeiro dia do mês desejado
        let startDate = new Date(targetYear, adjustedMonth, 1);
    
        onStartDateChange(formatDateToBack(startDate))
        onEndDateChange(formatDateToBack(today))
      }, [])

      useEffect(()=>{
        setDates(5)
        role === 'user' ? setPeriodOptions(periodOptionsUser):setPeriodOptions(periodOptionsAdmin)
      },[])

      const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        onCheckedChange(event.target.checked)
        setTitle(event.target.checked ? 'Valor' : 'Comissão');
      };

    return (
        <Stack direction={'row'} justifyContent={'space-evenly'} alignItems="center">
          <Stack direction={'row'} alignItems="center">
            <h3 style={{marginRight: '1vh'}}>Filtros:</h3>
            <Select
                options={periodOptions}
                onSelect={(value) => setDates(value)}
                defaultValue={5}
            />
            <h4 style={{marginLeft:'5vh'}}>Comissão</h4>
            <Switch checked={checked} onChange={handleSwitchChange} />
            <h4 style={{marginRight:'5vh'}}>Valor</h4>
          </Stack>
        </Stack>
    )
}