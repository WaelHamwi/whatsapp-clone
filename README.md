# nextjs-whatsapp-clone-starter
cd client npm install 
cd server npm install

To host your site with Firebase Hosting, you need the Firebase CLI (a command line tool).

Run the following npm command to install the CLI or update to the latest CLI version.

npm install -g firebase-tools

firebase login
firebase init
firebase deploy

cd path/to/client
firebase init hosting
firebase deploy --only hosting

npm install prisma --save-dev
npm install prisma@5.18.0
npm install @prisma/client@5.18.0

npx prisma generate
npx prisma db push
npx prisma studio
npx prisma init

cd server 
npm start  it will start depending on the port in the env you have just set

npm install react-icons

npm install react-dom


npx prisma db push
npx prisma studio 
after each push

npx prisma generate after each db amendment


Project: WhatsApp Real-Time Messenger Clone

Description: Developed a full-featured, real-time messaging application resembling WhatsApp, using Zegocloud API for seamless voice and video call integration. The application was built with React, Next.js, and Node.js, offering a smooth and responsive user experience across multiple devices.

Key Features:

User Authentication: Created a secure login page with seamless onboarding, ensuring user data protection and smooth entry into the app.
Main Chat Interface: Designed and implemented a dynamic chat interface, including a sidebar for easy access to all conversations and contacts.
Real-Time Messaging:
Text Messaging: Enabled real-time sending and receiving of text messages, incorporating features like emoji support to enhance communication.
Multimedia Messaging: Integrated image and voice message functionalities, allowing users to send and receive multimedia content effortlessly. Included a voice recording feature for sending voice notes.
Advanced Search Functionality: Developed robust search capabilities, allowing users to search messages within chats and find specific contacts in both the chat and sidebar.
Voice and Video Call Integration:
UI Development: Created an intuitive user interface for initiating and managing voice and video calls. The interface includes handling incoming call notifications.
Zegocloud API Integration: Integrated Zegocloud’s services for real-time voice and video communication, ensuring high-quality calls.
Message and Contact Management:
Search and Filter Contacts: Enabled search functionality in the sidebar and contact list, making it easy to find and manage contacts.
Session Management: Implemented features for exiting chats and securely logging out of the application.
Comprehensive Setup and Configuration: Set up the project environment and configured Zegocloud for voice and video calls, ensuring the application was ready for deployment.
Technologies Used: React, Next.js, Node.js, Zegocloud API, WebSockets, Sass.

This version emphasizes the real-time messaging and communication aspects of your project while highlighting the integration of Zegocloud and the use of modern web technologies like React, Next.js, and Node.js.