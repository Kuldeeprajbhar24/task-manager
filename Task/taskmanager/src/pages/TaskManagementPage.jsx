import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { useState,useEffect } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function TaskManagementPage(){

  const {API,user}=useAuth();
  const {created,setCreated,fetchTasks}=useTasks();
  const [edit,setEdit]=useState(null);

  useEffect(()=>{ fetchTasks(); },[]);

  // Access Restriction
  if(user.role!=="manager") return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400">Only managers can manage tasks</p>
      </div>
    </div>
  );

  // CREATE
  const create = async(data)=>{
    const res = await axios.post(`${API}/tasks`,data);
    setCreated(p=>[res.data,...p]);
  }

  // UPDATE (🔥 FIXED)
  const update = async(data)=>{

    if(!data._id){
      console.error("❌ UPDATE FAILED — No _id received", data);
      alert("Update failed — Task ID missing");
      return;
    }

    console.log("Updating Task ID →", data._id);

    const res = await axios.put(`${API}/tasks/${data._id}`,data);
    setCreated(p=>p.map(t=>t._id===data._id ? res.data : t));
    setEdit(null);
  }

  // DELETE
  const del = async(t)=>{
    if(!confirm("Delete task?")) return;
    await axios.delete(`${API}/tasks/${t._id}`);
    setCreated(p=>p.filter(a=>a._id!==t._id));
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Task Management</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Create, edit, and manage your tasks</p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FORM */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {edit ? "Edit Task" : "Create New Task"}
              </h3>

              <TaskForm 
                onSubmit={edit ? update : create}
                initialValues={edit}
              />
            </div>
          </div>

          {/* TASK LIST */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <TaskList 
                title="Created Tasks"
                tasks={created}
                onEdit={(task)=>setEdit(task)}  // 🔥 ensures full object is passed
                onDelete={del}
                isManager
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
