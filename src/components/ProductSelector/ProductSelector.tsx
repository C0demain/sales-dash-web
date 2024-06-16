import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { useEffect, useState } from 'react';
import { apiBackend, apiInstance } from 'services/api';

interface Product {
  id: string;
  name: string;
}

interface ProductSelectorProps {
  sendDataToParent: (data: Product[]) => void;
}

export default function ProductSelector({ sendDataToParent }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getProduct = async () => {
    try {
      const response = await apiInstance.get<{ products: Product[] }>(`${apiBackend}/api/v1/products/getAll`);
      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleProductChange = (event: any, productList: Product[]) => {
    sendDataToParent(productList);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack sx={{ width: 260 }}>
      <Autocomplete
        multiple
        size='small'
        limitTags={1}
        id="tags-outlined"
        options={products}
        getOptionLabel={(option) => option.name}
        autoHighlight
        filterSelectedOptions
        onChange={handleProductChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Selecione um produto"
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