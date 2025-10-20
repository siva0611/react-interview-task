React Developer Interview Task -VoltCart

A complete front-end application for a modern e-commerce store, built as a submission for a React Developer interview task. The project simulates a full user journey, from browsing products to placing an order, and includes a simplified admin panel for order management.

✨ Features

Dynamic Product Catalog: Browse products with real-time search and sorting.

User Authentication: Secure login/logout with Google (OAuth) via Firebase.

Shopping Cart & Wishlist: Fully functional cart and wishlist with intuitive UI feedback.

Checkout Flow: Users can manage shipping addresses and confirm orders, which updates product stock in the database.

Order History: A detailed history of all past orders and their real-time status.

Admin Panel: A separate admin page (/admin) to view all user orders and update their status.

🚀 Tech Stack

Front-End: React, Vite, React Router

State Management: React Context API

Backend (Simulated): json-server

Authentication: Firebase Authentication

Notifications: react-hot-toast

⚙️ Getting Started

1. Clone the repository:

git clone [https://github.com/siva0611/react-interview-task.git](https://github.com/siva0611/react-interview-task.git)
cd react-interview-task

2. Install dependencies:

npm install


3. Set up Firebase Environment Variables:

Create a .env file in the project root.

Add your Firebase project's configuration keys, prefixed with VITE_. For example: VITE_API_KEY="your-key-here".

4. Run the application:

You need two terminals running at the same time.

Terminal 1 (API Server):

npx json-server --watch db.json --port 3001


Terminal 2 (React App):

npm run dev


The application will be available at http://localhost:5173.