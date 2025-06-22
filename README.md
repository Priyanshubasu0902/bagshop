# BagShop E-commerce Platform

BagShop is a full-stack e-commerce web application built with Node.js, Express, and MongoDB. It features separate functionalities for regular users and store owners, allowing for product management, user authentication, and a shopping cart system.

## Features

### User Features
- **Authentication:** Secure user registration and login, logout using JWT.
- **Shop:** Browse all available products.
- **Filtering:** Filter products by availability, discount, and price range.
- **Sorting:** Sort products by their time of arrival either, default or latest products first.
- **Shopping Cart:** Add products to a personal cart and view its contents.

### Owner (Admin) Features
- **Admin Panel:** A dedicated panel for store owners with secure login.
- **Authentication:** Secure owner login, logout using JWT.
- **Product Management:**
    - Create new products with details like name, price, quantity, discount, and custom panel colors.
    - Upload product images.
    - View all created products in an admin dashboard.
    - Edit details of existing products.
    - Delete individual products or all products at once.
- **Owner Creation:** New owner accounts can only be created in the `development` environment for security.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **View Engine:** EJS (Embedded JavaScript templates)
- **Styling:** Tailwind CSS
- **Authentication:** JSON Web Tokens (jsonwebtoken), bcrypt
- **File Uploads:** Multer
- **Middleware:** cookie-parser, express-session, connect-flash
- **Configuration:** dotenv, config

## Project Structure

The repository is organized into the following directories:

```
.
├── app.js                  # Main application entry point
├── package.json            # Project dependencies and metadata
├── config/                 # Configuration files (DB connection, Multer)
├── controllers/            # Logic for handling user and owner authentication
├── middlewares/            # Custom middleware for authentication checks
├── models/                 # Mongoose schemas for users, owners, and products
├── public/                 # Static assets (images, stylesheets, client-side JS)
├── routes/                 # Express route definitions
├── utils/                  # Utility functions (e.g., token generation)
└── views/                  # EJS templates for the UI
```

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- Node.js installed
- MongoDB instance running on your local machine or a cloud service

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/priyanshubasu0902/bagshop.git
    cd bagshop.git
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    EXPRESS_SESSION_SECRET=yoursecretkeyforsessions
    JWT_KEY=yoursecretkeyforjwt
    NODE_ENV=development
    ```
    - `NODE_ENV=development` is required to enable the owner creation route.

4.  **Configure the database connection:**
    The application uses the `config` package. The MongoDB URI is set in `config/development.json` and `config/production.json`. You can modify `config/development.json` to point to your MongoDB instance.
    ```json
    // config/development.json
    {
         "MONGODB_URI": "mongodb://127.0.0.1:27017",
         "State": "development"
    }
    ```

5.  **Run the application:**
    ```sh
    node app.js
    ```
    The server will start on `http://localhost:3000`.

### Usage

1.  **Create an Owner Account:**
    Since you are in `development` mode, you can create an owner account. Use a tool like Postman or Insomnia to send a `POST` request to `http://localhost:3000/owners/create` with the following JSON body:
    ```json
    {
        "fullname": "Admin Name",
        "email": "admin@example.com",
        "password": "yourpassword"
    }
    ```

2.  **Access the Admin Panel:**
    Navigate to `http://localhost:3000/owners/login` and log in with the owner credentials you just created. From there, you can create, view, edit, and delete products.

3.  **Access the User Site:**
    - Navigate to `http://localhost:3000` to register or log in as a user.
    - Once logged in, you can browse the shop at `http://localhost:3000/shop`, add items to your cart, and view your cart at `http://localhost:3000/cart`.
