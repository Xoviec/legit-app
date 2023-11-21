import React from "react";
import {Route, Routes} from 'react-router-dom';
import App from "./App";
import { Login } from "./components/login";
import { Register } from "./components/register";
import { Anonymous } from "./components/anonymous";
import { UserPage } from "./components/userPage";
import { Settings } from "./components/settings";


export const Main = () =>{

    return(
        <Routes>
            <Route path='/' element={<App/>}/>
            <Route path='/users/:id' element={<UserPage/>}/>
            <Route path='/settings' element={<Settings/>}/>


            <Route element={<Anonymous />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Route>

            {/* <Route path='/users' element={<Users data={data} handleAddData={addData}/>}/>
            <Route path='/users/:id' element={<User data={data} setData={setData}/>}/> */}
         </Routes>
    )
}