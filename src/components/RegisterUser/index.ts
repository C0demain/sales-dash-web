import axios from 'axios';

export async function sendDataSeller(userName: String, email: string, cpf: string, funcao: string, senha: string) {
  
  const urlSeller = 'http://localhost:8000/api/v1/auth/register';

  const userData = {
    'name':userName,
    'email':email,
    'password':senha,
    'cpf': cpf,
    'role': funcao
  };

  const response = await axios.post(urlSeller, userData)
  if(response.status === 201) console.log("Dados enviados com sucesso")
}

export async function sendDataAdmin(name: String, email: string, cpf: string) {
  
  const urlAdmin = 'http://localhost:8000/api/v1/auth/registerAdmin';

  const userData = {
    'name': name,
    'email': email,
    'cpf': cpf
  };

  const response = await axios.post(urlAdmin, userData)
  if(response.status === 201) console.log("Dados enviados com sucesso")
}

export function isValidCPF(value: string): boolean {
    if (typeof value !== 'string') {
        return false;
    }

    value = value.replace(/[^\\d]+/g, '');

    if (value.length !== 11 || !!value.match(/(\\d)\\1 {10}/)) {
        return false;
    }

    const values = value.split('').map(el => +el);
    const rest = (count: number) => (values.slice(0, count - 12).reduce((soma, el, index) => (soma + el * (count - index)), 0) * 10) % 11 % 10;

    return rest(10) === values[9] && rest(11) === values[10];
}