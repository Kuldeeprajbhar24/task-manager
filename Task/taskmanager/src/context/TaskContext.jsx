import { createContext,useContext,useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const TaskContext=createContext();

export function TaskProvider({children}){
  const {API}=useAuth();
  const [assigned,setAssigned]=useState([]);
  const [created,setCreated]=useState([]);

  const fetchTasks=async()=>{
    const a=await axios.get(`${API}/tasks?type=assigned`);
    const c=await axios.get(`${API}/tasks?type=created`);
    setAssigned(a.data.tasks); setCreated(c.data.tasks);
  }

  return <TaskContext.Provider value={{assigned,created,setAssigned,setCreated,fetchTasks}}>
    {children}
  </TaskContext.Provider>
}
export const useTasks=()=>useContext(TaskContext);
