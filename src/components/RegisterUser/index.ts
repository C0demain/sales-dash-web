import axios from 'axios';

export async function sendDataSeller(userName: String, email: string, cpf: string, senha: string) {
  
  const urlSeller = 'http://localhost:8000/api/v1/auth/registerUser';

  const userData = {
    'name':userName,
    'email':email,
    'password':senha,
    'cpf': cpf
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
