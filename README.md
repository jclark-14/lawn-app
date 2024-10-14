# LawnCare Pro

A full-stack web application designed for homeowners who want to create and maintain a vibrant lawn. LawnCare Pro generates personalized lawn care plans based on the user's specific climate and lawn needs.

## Why I Built This

I built LawnCare Pro to address a common problem for homeowners: managing lawn care effectively based on their local climate. This project combines my passion for front-end development with my interest in creating a user-friendly tool that helps people achieve better lawn results.

## Live Demo

Check out the live demo: [LawnCare Pro](http://ec2-18-215-127-121.compute-1.amazonaws.com/))

## Technologies Used

- **Frontend**: React.js, TypeScript, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **APIs**: [Climate by ZIP](https://rapidapi.com/aptitudeapps/api/climate-by-zip)
- **Authentication**: JWT, Argon2

## Features

- User authentication for creating and saving lawn care plans.
- Zipcode-based climate data retrieval to recommend grass species ideal for the user's location.
- Personalized lawn care plans with step-by-step guides.
- Tracking progress with the ability to mark steps as completed.

## Preview

![LawnCare Pro Preview](assets/gif7.gif)

## Stretch Features

1. Integration with IoT devices for real-time lawn condition monitoring.
2. A community forum where users can share lawn care tips and achievements.
3. Implementing machine learning to provide smarter lawn care recommendations.
4. Notifications to remind users of upcoming tasks in their lawn care plan.

## Development

### System Requirements

- Node.js 18.18 or higher
- NPM 10 or higher
- PostgreSQL 14 or higher

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://github.com/yourusername/lawn-app
    cd client
    ```

2. Install all dependencies with NPM.

    ```shell
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the `server` directory with the following content:

    ```
    TOKEN_SECRET=<your_jwt_secret>
    DATABASE_URL=<your_database_url>
    ```

4. Import the database schema to PostgreSQL.

    ```shell
    createdb lawncarepro
    npm run db:import
    ```

5. Start the development server for the frontend and backend.

    ```shell
    npm run dev
    ```

6. Access the application by navigating to `http://localhost:3000` in your browser.
