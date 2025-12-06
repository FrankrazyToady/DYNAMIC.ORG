# Firebase Setup Guide

This guide will help you set up Firebase for your website's real-time database and authentication.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "dynamic-org")
4. Click **"Continue"**
5. (Optional) Disable Google Analytics if you don't need it
6. Click **"Create project"**
7. Wait for the project to be created, then click **"Continue"**

## Step 2: Enable Authentication

1. In your Firebase project, click on **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Click on the **"Sign-in method"** tab

### Enable Email/Password Authentication

4. Click on **"Email/Password"**
5. Enable the first toggle (Email/Password)
6. Click **"Save"**

### Enable Google Sign-In

7. Click on **"Google"** in the sign-in providers list
8. Enable the toggle
9. Enter a project support email (your email address)
10. Click **"Save"**

### Enable Apple Sign-In

11. Click on **"Apple"** in the sign-in providers list
12. Enable the toggle
13. Enter a **Services ID** (optional, but recommended for production)
14. Enter your **Apple Team ID** (found in your Apple Developer account)
15. Enter your **Key ID** and upload your **Private Key** (from Apple Developer account)
16. Click **"Save"**

> **Note**: Apple Sign-In requires an Apple Developer account ($99/year). For testing, you can skip the advanced configuration, but it's required for production.

### Enable Phone Authentication

17. Click on **"Phone"** in the sign-in providers list
18. Enable the toggle
19. Firebase will automatically set up phone authentication
20. For production, you may need to verify your domain and configure reCAPTCHA
21. Click **"Save"**

> **Note**: Phone authentication uses SMS verification codes. Make sure you have sufficient quota in your Firebase plan.

## Step 3: Create Firestore Database

1. In your Firebase project, click on **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
   - ⚠️ **Important**: For production, you'll need to set up proper security rules
4. Choose a location for your database (select the closest to your users)
5. Click **"Enable"**

## Step 4: Get Your Firebase Configuration

1. In your Firebase project, click on the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click on the **Web icon** `</>` to add a web app
5. Register your app with a nickname (e.g., "Dynamic.org Website")
6. (Optional) Check "Also set up Firebase Hosting"
7. Click **"Register app"**
8. Copy the `firebaseConfig` object that appears

## Step 5: Configure Your Website

1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",                    // Replace with your apiKey
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // Replace with your authDomain
    projectId: "YOUR_PROJECT_ID",              // Replace with your projectId
    storageBucket: "YOUR_PROJECT_ID.appspot.com",   // Replace with your storageBucket
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",   // Replace with your messagingSenderId
    appId: "YOUR_APP_ID"                       // Replace with your appId
};
```

## Step 6: Set Up Firestore Security Rules (Important!)

1. In Firebase Console, go to **"Firestore Database"**
2. Click on the **"Rules"** tab
3. Replace the default rules with these (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can create contact submissions, but only authenticated users can read them
    match /contactSubmissions/{submissionId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
    }
  }
}
```

4. Click **"Publish"**

⚠️ **Note**: These rules allow authenticated users to manage their own data. For production, you may want stricter rules.

## Step 7: Configure Authorized Domains

For social login to work, you need to authorize your domains:

1. In Firebase Console, go to **Authentication** → **Settings**
2. Scroll down to **Authorized domains**
3. Add your domains:
   - `localhost` (for local development)
   - Your production domain (e.g., `yourdomain.com`)
   - Firebase automatically includes `YOUR_PROJECT_ID.firebaseapp.com`

## Step 8: Test Your Setup

1. Open `index.html` in your browser (use a local server for social login)
2. Try signing up with:
   - Email/Password
   - Google Sign-In
   - GitHub Sign-In
   - Facebook Sign-In
3. Check Firebase Console > Authentication to see the new users
4. Check Firebase Console > Firestore Database to see the user documents

> **Note**: Social login requires your site to be served over HTTPS (or localhost). For local testing, use a local server like `python -m http.server` or `npx serve`.

## Collections Structure

Your Firestore database will have these collections:

### `users` Collection
- Document ID: User's UID (from Firebase Auth)
- Fields:
  - `name` (string): User's full name
  - `email` (string): User's email
  - `createdAt` (timestamp): Account creation time
  - `updatedAt` (timestamp): Last update time

### `contactSubmissions` Collection
- Document ID: Auto-generated
- Fields:
  - `name` (string): Submitter's name
  - `email` (string): Submitter's email
  - `subject` (string): Message subject
  - `message` (string): Message content
  - `timestamp` (timestamp): Submission time
  - `read` (boolean): Whether the message has been read

## Real-time Features

The website uses Firebase's real-time listeners, which means:
- User data updates automatically when changed in Firestore
- No page refresh needed to see updates
- Changes sync across all devices instantly

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure you've correctly copied all configuration values
- Check that Firebase is properly initialized before script.js runs

### "Firebase: Error (auth/operation-not-allowed)"
- Go to Authentication > Sign-in method
- Make sure Email/Password is enabled

### "Firebase: Error (permission-denied)"
- Check your Firestore security rules
- Make sure the rules allow the operation you're trying to perform

### Data not appearing in Firestore
- Check the browser console for errors
- Verify your security rules allow the operation
- Make sure you're looking at the correct Firestore database (not Realtime Database)

## Production Considerations

Before deploying to production:

1. **Update Security Rules**: Implement proper security rules based on your needs
2. **Enable Email Verification**: Add email verification in Authentication settings
3. **Set Up Custom Domain**: Configure a custom domain for Firebase Hosting
4. **Enable Analytics**: Set up Firebase Analytics for insights
5. **Backup Strategy**: Set up regular backups of your Firestore database
6. **Rate Limiting**: Consider implementing rate limiting for API calls

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

