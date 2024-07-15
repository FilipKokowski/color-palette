import { Route, Routes } from "react-router-dom"

import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import Favourites from "./pages/Favourites"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/favourites" element={<Favourites/>}></Route>
    </Routes>
  )
}

export default App
