export default function TaskCard({task,onStatusChange,onEdit,onDelete,isManager}){
  return <div className="p-4 border rounded bg-white dark:bg-gray-800 shadow">
    <h3 className="font-semibold text-lg">{task.title}</h3>
    <p className="text-sm opacity-80">{task.description}</p>

    <div className="flex flex-wrap gap-2 mt-2">
      {["todo","in_progress","completed"].map(s=>
        <button key={s} onClick={()=>onStatusChange?.(task,s)}
          className={`text-xs px-2 py-1 rounded border ${
            task.status===s?"bg-indigo-600 text-white":""
          }`}>{s}</button>
      )}

      {isManager && <>
        <button className="text-xs border px-2 py-1" onClick={()=>onEdit(task)}>Edit</button>
        <button className="text-xs border px-2 py-1 text-red-500 border-red-500" onClick={()=>onDelete(task)}>Delete</button>
      </>}
    </div>
  </div>
}
