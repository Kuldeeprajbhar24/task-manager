📝 Collaborative Task Manager (MERN + JWT + RBAC)

This project is a Collaborative Task Management Web Application built using React + Node.js + MongoDB. It supports role-based access control where Managers can create and assign tasks, while Users can manage tasks assigned to them. The app includes user authentication, task CRUD operations, activity logging, dark mode UI, and protected routing.

Users can register and log in securely using JWT authentication. After logging in, the Dashboard displays tasks assigned to the user, and for managers, tasks they created. A dedicated Task Management panel allows managers to create, update, delete, and assign tasks to any registered user. Users can update task status to todo / in-progress / completed. Task state is synchronized dynamically across UI using Context API.

MongoDB stores all users and tasks, while each task update is tracked using an Activity Log system. The UI is responsive, built with Tailwind CSS, and includes dark mode toggle for better UX.

This system is scalable, easy to extend, and ideal for teams to coordinate task assignments efficiently. Future improvements can include WebSocket updates, Kanban drag-drop, and notification system.
