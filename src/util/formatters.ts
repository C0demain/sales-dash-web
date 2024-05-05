const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (value: string): string => {
    return new Date(value+'T00:00').toLocaleDateString('pt-BR')
}

export {formatCurrency, formatDate}