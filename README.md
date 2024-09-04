#!/bin/bash

# 1. Set up the Client
echo "Setting up the Client..."
cd client && npm install

# 2. Set up the Server
echo "Setting up the Server..."
cd ../server && npm install

# 3. Install Firebase CLI globally and Firebase in the project
echo "Installing Firebase CLI and Firebase..."
npm install -g firebase-tools
npm install firebase

# 4. Firebase Login, Initialization, and Deployment
echo "Logging in to Firebase..."
firebase login

echo "Initializing Firebase..."
firebase init

echo "Deploying Firebase..."
firebase deploy

# 5. Initialize Firebase Hosting in the Client Directory and Deploy
echo "Initializing
