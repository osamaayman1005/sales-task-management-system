# Sales Task Management System

The **Sales Task Management System** is a backend API that manages sales tasks and assigns them to sales agents based on their success rates. The system automates task allocation through cron jobs, ensures that tasks are assigned fairly, and provides role-based access control for different users (Admins, Sales Agents, and Lead Generators).

---

## Features

- **Task Management**: Allows Lead Generators (Presales) to create tasks with customer information, priority levels, and descriptions.
- **Task Assignment**: Admins can manually assign tasks to Sales Agents, and the system automatically allocates tasks based on success rate.
- **Role-Based Access**: Supports Admin, Sales Agent, and Lead Generator roles, each with specific permissions.
- **Automatic Task Allocation**: Tasks are automatically allocated to Sales Agents at specified intervals via a cron job.
- **Priority Queue**: Tasks are assigned based on priority (Highest, High, Medium, Low).
- **Task Locking**: Once a task is assigned, it is locked and cannot be reassigned until it's completed.

---

## Used Libraries and Tools

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **PostgreSQL**: An advanced, enterprise-class open-source relational database system.
- **TypeORM**: An ORM for TypeScript and JavaScript (ES7, ES6, ES5) that works in Node.js and browser.
- **Passport**: Middleware for authentication in Node.js applications.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/osamaayman1005/sales-task-management-system.git

2. Install dependacies
    ```bash
    npm install
3. Run docker image

    ```bash
    docker compose up
4. Run the server

    ```bash
    nest start --watch