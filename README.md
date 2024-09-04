# Next.js WhatsApp Clone Starter

This repository provides a step-by-step setup for a Next.js WhatsApp clone project. Below is a single bash script that you can copy and execute to install dependencies, set up Firebase, and configure Prisma.

## Setup Instructions

To get started, copy the following script into your terminal:

```bash
# 1. Set up the Client
cd client && npm install

# 2. Set up the Server
cd ../server && npm install

# 3. Install Firebase CLI globally and Firebase in the project
npm install -g firebase-tools
npm install firebase

# 4. Firebase Login and Initialization
firebase login
firebase init

# 5. Deploy Firebase
firebase deploy

# 6. Initialize Firebase Hosting in the Client Directory and Deploy
cd ../client
firebase init hosting
firebase deploy --only hosting

# 7. Install Prisma Dependencies
npm install --save-dev prisma
npm install prisma@5.18.0
npm install @prisma/client@5.18.0

# 8. Prisma Setup
npx prisma generate
npx prisma db push
npx prisma studio
npx prisma init

# 9. Start the Server
cd ../server
npm start

# 10. Install Additional Dependencies
npm install react-icons
npm install react-dom
npm audit fix --force
npm install cors
npm cache clean --force

# 11. Run Prisma Commands After Each Database Push
npx prisma db push
npx prisma studio
npx prisma generate

# 12. Install Security-Related Package
npm install helmet
