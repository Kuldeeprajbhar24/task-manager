import { useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import TaskList from "../components/TaskList";
import axios from "axios";

export default function DashboardPage(){
  const {user,API}=useAuth();
  const {assigned,created,fetchTasks,setAssigned,setCreated}=useTasks();

  useEffect(()=>{ fetchTasks(); },[]);

  const updateStatus=async(task,status)=>{
    const res=await axios.put(`${API}/tasks/${task._id}/status`,{status});
    const updated=res.data;
    const update=list=>list.map(t=>t._id===updated._id?updated:t);
    setAssigned(update(assigned)); 
    setCreated(update(created));
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Welcome back, <span className="text-blue-600 dark:text-blue-400">{user.name}</span> 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Here's what's on your plate today</p>
          </div>
        </div>

        <div className={`grid gap-8 ${user.role==="manager"?"lg:grid-cols-1":"lg:grid-cols-1"}`}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <TaskList 
              title="Your Assigned Tasks" 
              tasks={assigned} 
              onStatusChange={updateStatus}
            />
          </div>

          {user.role==="manager" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <TaskList 
                title="Tasks You Created" 
                tasks={created} 
                onStatusChange={updateStatus} 
                isManager
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};