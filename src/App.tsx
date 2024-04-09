import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Exemplo from './components/Exemplo'
import './App.css'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/exemplo' element={<Exemplo/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
