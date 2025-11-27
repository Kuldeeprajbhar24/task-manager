import { createContext,useContext,useState,useEffect } from "react";
import axios from "axios";
export const AuthContext=createContext();
const API="http://localhost:5000/api";

export function AuthProvider({children}){
  const [token,setToken]=useState(localStorage.token||"");
  const [user,setUser]=useState(JSON.parse(localStorage.user||"null"));

  useEffect(()=>{
    if(token){
      axios.defaults.headers.common["Authorization"]=`Bearer ${token}`;
      localStorage.token=token;
    }
    if(user) localStorage.user=JSON.stringify(user);
  },[token,user]);

  const login=async(email,password)=>{
    const res=await axios.post(`${API}/auth/login`,{email,password});
    setToken(res.data.token); setUser(res.data.user);
  }

  const signup=async(payload)=>{
    const res=await axios.post(`${API}/auth/signup`,payload);
    setToken(res.data.token); setUser(res.data.user);
  }

  const logout=()=>{ setUser(null);setToken("");localStorage.clear(); }

  return <AuthContext.Provider value={{API,user,token,login,signup,logout}}>
    {children}
  </AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext);
