import { FormControl, InputLabel, Box, MenuItem } from '@mui/material';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';
import { DeleteFilled } from '@ant-design/icons';
import * as React from 'react';
import { useCallback } from 'react';
import { apiInstance } from 'services/api';

const ITEM_HEIGHT = 45;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  {
    label: 'cliente 1',
    value: 1
  },
  {
    label: 'Cliente 2',
    value: 2
  },
  {
    label: 'Cliente 3',
    value: 3
  },
  {
    label: 'Cliente 4',
    value: 4
  },
  {
    label: 'Cliente 5',
    value: 5
  },
];

function getStyles(name: string, clientName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      clientName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function ClientSelector() {
  const theme = useTheme();
  const [clientName, setClientName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof clientName>) => {
    const {
      target: { value },
    } = event;
    setClientName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    console.log(event.target.value);
  };

  const handleDelete = (e: any, value: any) => {
    e.preventDefault()
    setClientName(clientName.filter((name) => name !== value))
  }
  const handleClick = (e: any, value: any) => {
    e.preventDefault()
    setClientName(clientName.filter((name) => name !== value))
  }

  const getClients = useCallback(async () => {
    let url = "http://localhost:8000/api/v1/client/getclients"

    const response = await apiInstance.get(url, {
      withCredentials: false,
    });
    //console.log(url)
  }
  )

  return (
    <div>
      <FormControl size='small' sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Clientes</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={clientName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value}
                  label={value}
                  onMouseDown={(e) => e.stopPropagation()}
                  deleteIcon={<DeleteFilled />}
                  onClick={(e) => handleClick(e, value)}
                  onDelete={(e) => handleDelete(e, value)} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name.label}
              value={name.label}
              style={getStyles(name.label, clientName, theme)}
            >
              {name.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
