# Next.js WhatsApp Clone Starter

This guide provides a step-by-step process to set up and deploy your Next.js WhatsApp clone project. The following script installs dependencies, sets up Firebase, and configures Prisma.

## Setup Instructions

To get started, copy and run the following script in your terminal:

```bash
#!/bin/bash

# Set up the Client
cd client && npm install

# Set up the Server
cd ../server && npm install

# Install Firebase CLI globally and Firebase in the project
npm install -g firebase-tools
npm install firebase

# Firebase Login and Initialization
firebase login
firebase init

# Deploy Firebase
firebase deploy

# Initialize Firebase Hosting in the Client Directory and Deploy
cd ../client
firebase init hosting
firebase deploy --only hosting

# Install Prisma Dependencies
npm install --save-dev prisma
npm install prisma@5.18.0
npm install @prisma/client@5.18.0

# Prisma Setup
npx prisma generate
npx prisma db push
npx prisma studio
npx prisma init

# Start the Server
cd ../server
npm start

# Install Additional Dependencies
npm install react-icons
npm install react-dom
npm audit fix --force
npm install cors
npm cache clean --force

# Run Prisma Commands After Each Database Push
npx prisma db push
npx prisma studio
npx prisma generate

# Install Security-Related Package
npm install helmet
