export const isValidCPF = (cpf: string): boolean => {
    if (typeof cpf !== "string") return false;
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    let sum = 0;
    let mod;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    mod = sum % 11;
    if (mod === 0 || mod === 1) {
        if (parseInt(cpf.charAt(9)) !== 0) return false;
    } else {
        if (parseInt(cpf.charAt(9)) !== 11 - mod) return false;
    }
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    mod = sum % 11;
    if (mod === 0 || mod === 1) {
        if (parseInt(cpf.charAt(10)) !== 0) return false;
    } else {
        if (parseInt(cpf.charAt(10)) !== 11 - mod) return false;
    }
    return true;
};

export const isValidCNPJ = (cnpj: string): boolean => {
    if (typeof cnpj !== "string") return false;
    cnpj = cnpj.replace(/[^\d]/g, '');
    if (cnpj.length !== 14) return false;
    let sum = 0;
    let mod;
    let weight = 2;
    for (let i = 11; i >= 0; i--) {
        sum += parseInt(cnpj.charAt(i)) * weight;
        weight = weight === 9 ? 2 : weight + 1;
    }
    mod = sum % 11;
    if (mod < 2) {
        if (parseInt(cnpj.charAt(12)) !== 0) return false;
    } else {
        if (parseInt(cnpj.charAt(12)) !== 11 - mod) return false;
    }
    sum = 0;
    weight = 2;
    for (let i = 12; i >= 0; i--) {
        sum += parseInt(cnpj.charAt(i)) * weight;
        weight = weight === 9 ? 2 : weight + 1;
    }
    mod = sum % 11;
    if (mod < 2) {
        if (parseInt(cnpj.charAt(13)) !== 0) return false;
    } else {
        if (parseInt(cnpj.charAt(13)) !== 11 - mod) return false;
    }
    return true;
};