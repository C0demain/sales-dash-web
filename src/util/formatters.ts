const formatCurrency = (value: number): string => {
    const currencyValue = new Number(value);
    return currencyValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
};

const formatDate = (value: string): string => {
    if (!value) return ""
    return new Date(value + 'T00:00').toLocaleDateString('pt-BR')
}

const formatDateObj = (value: string): Date => {
    return new Date(value + 'T00:00')
}

function formatDateToBack(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const customLocale = {
    filterTitle: 'Filtrar',
    filterConfirm: 'OK',
    filterReset: 'Resetar',
    filterEmptyText: 'Sem filtros',
    emptyText: 'Nenhuma venda encontrada',
    selectAll: 'Selecionar página atual',
    selectInvert: 'Inverter seleção na página atual',
    sortTitle: 'Ordenar',
    triggerDesc: 'Clique para ordenar descendentemente',
    triggerAsc: 'Clique para ordenar ascendentemente',
    cancelSort: 'Clique para cancelar ordenação'
};

export { formatCurrency, formatDate, formatDateToBack, formatDateObj, customLocale }
