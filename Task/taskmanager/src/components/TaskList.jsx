import TaskCard from "./TaskCard";

export default function TaskList({title,tasks,onStatusChange,onEdit,onDelete,isManager}){
  return <section className="space-y-3">
    <h2 className="font-bold text-lg">{title} ({tasks.length})</h2>
    {tasks.length===0?"No Tasks Available":
    <div className="grid md:grid-cols-2 gap-3">
      {tasks.map(t=>(
        <TaskCard key={t._id} task={t}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
          isManager={isManager}
        />
      ))}
    </div>}
  </section>
}
