import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { apiInstance } from 'services/api';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

interface Client {
  id: string;
  name: string;
  segment: string;
  cpf: string;
}

interface ClientSelectorProps {
  sendDataToParent: (data: Client[]) => void;
}

export default function ClientSelector({ sendDataToParent }: ClientSelectorProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const getClients = async () => {
    try {
      const response = await apiInstance.get<{ client: Client[] }>('http://localhost:8000/api/v1/clients/getclients');
      if (response.data && response.data.client) {
        setClients(response.data.client);
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  const handleClientChange = (event: any, clientList: Client[]) => {
    sendDataToParent(clientList);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={3} sx={{ width: 250 }}>
      <Autocomplete
        multiple
        limitTags={1}
        id="tags-outlined"
        options={clients}
        getOptionLabel={(option) => option.name}
        autoHighlight
        filterSelectedOptions
        onChange={handleClientChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Selecione um cliente"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
        renderOption={(props, option, { inputValue }) => {
          const matches = match(option.name, inputValue, { insideWords: true });
          const parts = parse(option.name, matches);

          return (
            <li {...props} key={option.id}>
              <div>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ color: part.highlight ? '#FF0000' : '#000000' }}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            </li>
          );
        }}
      />
    </Stack>
  );
}
