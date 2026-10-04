import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/landing";
import Home from "./pages/homepage";
import Login from "./pages/login";
import Signup from "./pages/signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Landing/>}/>
        <Route path = "/homepage" element = {<Home/>}/>
        <Route path = "/login" element = {<Login/>}/>
        <Route path = "/signup" element = {<Signup/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
