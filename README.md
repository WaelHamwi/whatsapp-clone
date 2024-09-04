# Set up the client
cd client && npm install

# Set up the server
cd ../server && npm install

# Install Firebase CLI globally and Firebase in the project
npm install -g firebase-tools
npm install firebase

# Log in to Firebase, initialize, and deploy
firebase login
firebase init
firebase deploy

# Initialize Firebase Hosting in the client directory and deploy only hosting
cd ../client
firebase init hosting
firebase deploy --only hosting

# Install Prisma dependencies
npm install --save-dev prisma
npm install prisma@5.18.0
npm install @prisma/client@5.18.0

# Generate Prisma client and push to database
npx prisma generate
npx prisma db push
npx prisma studio
npx prisma init

# Start the server with environment configuration
cd ../server
npm start

# Install additional dependencies
npm install react-icons
npm install react-dom
npm audit fix --force
npm install cors
npm cache clean --force

# Run Prisma commands after each database push
npx prisma db push
npx prisma studio
npx prisma generate

# Install security-related package
npm install helmet
