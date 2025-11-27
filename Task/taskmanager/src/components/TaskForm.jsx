import { useState, useEffect } from "react";

export default function TaskForm({ onSubmit, initialValues }) {

  const emptyTask = {
    _id: "",
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium"
  };

  const [form, setForm] = useState(emptyTask);

  // ↪ Load task when editing, otherwise blank form
  useEffect(() => {
    if (initialValues) setForm(initialValues);
    else setForm(emptyTask);
  }, [initialValues]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);        // contains `_id` only on update
    setForm(emptyTask);    // reset after save
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-4 border rounded bg-white dark:bg-gray-800 space-y-3"
    >

      <input
        name="title"
        value={form.title}
        onChange={change}
        placeholder="Task Title"
        className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={change}
        placeholder="Task Description"
        className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        name="priority"
        value={form.priority}
        onChange={change}
        className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        name="assignedTo"
        value={form.assignedTo}
        onChange={change}
        placeholder="Assign to User ID"
        className="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold w-full py-2 rounded shadow-md">
        {form._id ? "Update Task" : "Create Task"}
      </button>

    </form>
  );
}
