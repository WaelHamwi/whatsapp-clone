#!/bin/bash

# Set up the Client
echo "Setting up the Client..."
cd client
npm install
echo "Client setup completed."

# Set up the Server
echo "Setting up the Server..."
cd ../server
npm install
echo "Server setup completed."

# Install Firebase CLI globally and Firebase in the project
echo "Installing Firebase CLI and Firebase..."
npm install -g firebase-tools
npm install firebase
echo "Firebase installation completed."

# Firebase Login, Initialization, and Deployment
echo "Logging in to Firebase..."
firebase login
echo "Initializing Firebase..."
firebase init
echo "Deploying Firebase..."
firebase deploy

# Initialize Firebase Hosting in the Client Directory and Deploy
echo "Initializing Firebase Hosting in the Client directory..."
cd ../client
firebase init hosting
echo "Deploying Firebase Hosting..."
firebase deploy --only hosting

# Install Prisma Dependencies
echo "Installing Prisma dependencies..."
npm install --save-dev prisma
npm install prisma@5.18.0
npm install @prisma/client@5.18.0

# Prisma Setup
echo "Setting up Prisma..."
npx prisma generate
npx prisma db push
npx prisma studio
npx prisma init
echo "Prisma setup completed."

# Start the Server
echo "Starting the Server..."
cd ../server
npm start
echo "Server started."

# Install Additional Dependencies
echo "Installing additional dependencies..."
npm install react-icons
npm install react-dom
npm audit fix --force
npm install cors
npm cache clean --force
echo "Additional dependencies installed."

# Run Prisma Commands After Each Database Push
echo "Running Prisma commands..."
npx prisma db push
npx prisma studio
npx prisma generate
echo "Prisma commands executed."

# Install Security-Related Package
echo "Installing Helmet for security..."
npm install helmet
echo "Helmet installed."

echo "Setup complete!"
