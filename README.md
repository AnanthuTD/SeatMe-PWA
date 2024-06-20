# Seating Arrangement PWA

Welcome to the **Seating Arrangement PWA**. This Progressive Web Application (PWA) is designed to help you manage and organize seating arrangements efficiently. Built with cutting-edge technologies like Next.js for the frontend, Ant Design (antd) for the UI components, Tailwind CSS for styling, and Husky for Git hooks management, this application ensures a seamless and high-performance user experience.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)

## Features

- **Dynamic Seating Arrangements**: Create and manage seating arrangements easily.
- **Responsive Design**: Optimized student and invigilator pages for desktop and mobile devices.
- **User Authentication**: Secure login functionality.
- **Role-based Access Control**: Different access levels for admins, staffs, invigilators and users.
- **Drag and Drop Interface**: Intuitive drag and drop functionality for arranging rooms.
- **Export and Import**: Export seating plans and import them back when needed.

## Technologies Used

- **Next.js**: For server-side rendering and static site generation.
- **Ant Design (antd)**: For a rich set of UI components.
- **Tailwind CSS**: For utility-first CSS styling.
- **Husky**: For Git hooks management to ensure code quality.
- **React**: For building the user interface.
- **Node.js**: For the backend server.
- **Express.js**: For handling server-side logic.
- **MySql**: For database management.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (>= 14.x)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/seating-arrangement-pwa.git
    cd seating-arrangement-pwa
    ```

2. **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Set up environment variables**:

   Create a `.env.local` file in the root directory and add the following environment variables:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000/api
    MONGODB_URI=mongodb://localhost:27017/seating-arrangement
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

1. **Run the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

2. **Run Husky pre-commit hooks**:
    Husky is configured to run linting and tests before every commit to ensure code quality.

## Usage

- **Creating a Seating Arrangement**:
  Navigate to the "Create" page, select the number of seats, and use the drag and drop interface to arrange them as needed.

- **Managing Users**:
  Admins can navigate to the "Users" page to manage user roles and access levels.

- **Exporting and Importing Plans**:
  Use the "Export" button to save your seating plan as a file and the "Import" button to load a previously saved plan.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or feedback, please contact:

- **Name**: Your Name
- **Email**: your.email@example.com
- **GitHub**: [yourusername](https://github.com/yourusername)

Thank you for using the **Seating Arrangement PWA**! We hope it meets your needs and enhances your event management experience.
