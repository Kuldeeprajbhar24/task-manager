import { Link,useNavigate,useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar(){
  const {user,logout}=useAuth();
  const {dark,toggle}=useTheme();
  const loc=useLocation(),nav=useNavigate();

  return <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" onClick={()=>nav("/")}>{`Task Manager`}</h1>

        <div className="flex gap-3 sm:gap-6 items-center">
          <button 
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-lg"
            aria-label="Toggle theme"
          >
            {dark?"🌞":"🌙"}
          </button>

          {user?<div className="flex gap-3 sm:gap-6 items-center">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-800">
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{user.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">{user.role}</span>
            </div>

            {user.role==="manager" && <Link to="/tasks" className="hidden sm:inline px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 text-sm font-medium">{`Manage`}</Link>}
            
            <button 
              onClick={logout} 
              className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-lg transition-colors duration-200"
            >{`Logout`}</button>
          </div>:<div className="flex gap-2 sm:gap-4">
            {loc.pathname!=="/login" && <Link to="/login" className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">{`Login`}</Link>}
            {loc.pathname!=="/signup" && <Link to="/signup" className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors duration-200">{`Signup`}</Link>}
          </div>}
        </div>

      </div>
    </div>
  </header>
}