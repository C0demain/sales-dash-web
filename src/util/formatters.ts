import dayjs from 'dayjs';

const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
};

const formatDate = (value: string): string => {
    return new Date(value+'T00:00').toLocaleDateString('pt-BR')
}

const formatDateObj = (value:string): Date => {
    return new Date(value+'T00:00')
}

function formatDateToBack(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export {formatCurrency, formatDate, formatDateToBack, formatDateObj}