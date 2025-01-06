Simple Order Management System
This project is a Simple Order Management System designed to manage users, roles, customers, products, and orders within an organization. It is built using .NET 5 (Dev Architecture) for the backend, Angular 18 for the frontend, and Microsoft SQL Server for the database.

Features
Functionalities:
User Management: Users (Admin, Customer Representative, and Employee) can log in, manage their profiles, and perform role-specific tasks.
Role Management: Assign multiple roles to a single user (Admin-only functionality).
Customer Management: Add and update customer details.
Product Management: Manage products, colors, and sizes (supports S, M, L, XL as enums).
Order Management: Place orders based on available inventory. Users are alerted if a product is out of stock.
Reports:
Inventory Report: View available products in stock.
Order Report: Track orders and their statuses.
Technology Stack:
Backend:
.NET 5 with multi-layered architecture.
MediatR and CQRS for command and query segregation.
LINQ for data querying.
Dev Architecture for user, role, and authorization management.
Frontend:
Angular 18 with Angular Lifecycle, Dialog, HTML, and CSS.
Database:
Microsoft SQL Server for storing all data securely.
Passwords are hashed and salted for security.
Application Structure
Roles:
Admin:

Manage users and roles.
Access all reports and management functionalities.
Customer Representative:

Manage customers and orders.
Access inventory and order reports.
Employee:

Manage products and access reports.
Key Pages:
Login Page: Mandatory for accessing the system.
User Management: Admin can create and manage users.
Role Management: Admin can assign and modify roles.
Customer Management: Admin and Customer Representatives can add or update customers.
Product Management: All roles can add and update products.
Order Management: Customer Representatives create orders after inventory validation.
Reports: Inventory and order reports accessible based on roles.
Additional Features:
Soft Delete: Instead of removing data, a IsDeleted flag is used to hide it from the frontend.
Enum Usage: Sizes are stored as integers in the database and displayed as strings to the user.
Dynamic Color Management:
A modal (Angular Dialog) allows creating, updating, and deleting colors.
Previously defined colors are displayed for easy management.
System Requirements:
.NET 5 for backend development.
Angular CLI 18 for frontend development.
Microsoft SQL Server for database management.
