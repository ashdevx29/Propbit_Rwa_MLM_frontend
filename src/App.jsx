// import './App.css'
// import { BrowserRouter } from 'react-router-dom';
// import CommanRoutes from './Routes/CommanRoutes';
// import AdminRoutes from './Routes/AdminRoutes';
// import UserRoutes from './Routes/UserRoutes';
// // import { ToastContainer } from 'react-toastify';

// function App() {

//   return (
//     <>

//       <BrowserRouter>
//         {/* <ToastContainer /> */}

//         <AdminRoutes  />
//         <CommanRoutes />
//         <UserRoutes />
//       </BrowserRouter>

//     </>
//   )
// }

// export default App

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CommanRoutes from "./Routes/CommanRoutes.jsx";
import AdminRoutes from "./Routes/AdminRoutes.jsx";
import UserRoutes from "./Routes/UserRoutes.jsx";
// import Login from "./Login/Login.jsx";
// import Signup from "./Login/Signup.jsx";

// import Header from "./componentPage/Directives/Header.jsx";
// import Homepage from "./Pages/Homepage.jsx";
// import Footer from "./componentPage/Directives/Footer.jsx";

function App() {
  return (
    <BrowserRouter>
      

      {/* Existing Project Routes */}
      <AdminRoutes />
      <CommanRoutes />
      <UserRoutes />
      
      
    </BrowserRouter>
  );
}

export default App;
