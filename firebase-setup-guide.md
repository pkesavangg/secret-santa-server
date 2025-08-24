# How to Get Firebase Service Account Key

## Step-by-Step Instructions

1. Go to the Firebase Console: https://console.firebase.google.com/
2. Select your project "BabyChris"
3. Click on the gear icon (⚙️) next to "Project Overview" to access Project settings
4. Select the "Service accounts" tab
5. Under the "Firebase Admin SDK" section, click "Generate new private key"
6. Click "Generate key" in the popup dialog
7. A JSON file will be downloaded to your computer
8. Save this file in a secure location (outside of your code repository)

## Option 1: Use the Service Account File Directly

1. Move the downloaded JSON file to a secure location
2. Update your `.env` file with the file path:
   ```
   FIREBASE_SERVICE_ACCOUNT_PATH=/secure/path/to/babychris-b3b6c-firebase-adminsdk-xxxxx-xxxxxxxx.json
   ```
3. Comment out the other Firebase credential variables

## Option 2: Extract Credentials from the JSON File

If you prefer to use environment variables, open the downloaded JSON file and:

1. Copy the `project_id` value to `FIREBASE_PROJECT_ID`
2. Copy the `client_email` value to `FIREBASE_CLIENT_EMAIL` 
3. Copy the `private_key` value to `FIREBASE_PRIVATE_KEY` (keep it exactly as it appears in the JSON file)
4. Set the `FIREBASE_DATABASE_URL` to `https://[YOUR_PROJECT_ID].firebaseio.com`

## Run the Test Again

After updating your credentials, run the test again:

```bash
cd /Users/kesavan/iosDevelopment/secret-santa-server && node test-firebase.js
```
