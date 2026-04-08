# Fitness Tracker Modern App 🏃‍♂️🏋️‍♀️

Welcome to the **Fitness Tracker** — a highly modernized, production-ready React Native application built entirely with Expo and Firebase. 

This application offers an intuitive User Interface designed from the ground up featuring secure local Biometric authentications, natively scheduled daily push notifications, complex workout scheduling, built-in timing engines, and cloud-synced daily goals visualised into stunning analytical dashboards!

---

## ✨ Core Features

* 🔐 **Fort Knox Security & Biometric Logins** 
  * Powered natively by `@expo/local-authentication` and `expo-secure-store`. Save your password deeply onto iOS Keychain / Android Keystore.
  * Optionally require **FaceID** or **TouchID** strictly before loading app contents (even if already logged in) via Settings logic! 
* 📊 **Smart Dynamic Dashboards** 
  * Watch your daily tracked activities (steps, calories, sleep, and workouts) populate seamlessly into real-time analytical charts built over Firestore snapshots.
* 🍔 **Complex Drawer + Tab Routing**
  * Modern `expo-router` v4 file-based nesting logic successfully combining sliding side-bar standard Drawers containing nested Bottom-Tab groups preventing messy navigation flows.
* ⏱ **Native Active Workout Timers**
  * Built in chronometer logic to actively run dynamic timing during live workouts, which then calculates intervals and auto-saves the metrics right to your dashboard seamlessly.
* ⏰ **Persistent OS Daily Reminders**
  * Local notification scheduling securely pinging you daily at 6:00 PM natively asking you to track your daily progress leveraging `expo-notifications`.
* 🎯 **Daily Goals Targets**
  * Set arbitrary limits and caps locally syncing flawlessly with `AsyncStorage` algorithms preventing cloud-waste and visualising daily completion metrics seamlessly!

---

## 🛠 Tech Stack Core

| Technology | Implementation Scope |
| :---: | :--- |
| **Expo SDK 54** | The core foundational native React-Native harness scaling iOS / Android flawlessly. |
| **Expo Router** | Revolutionary folder-based deep-linking routing architecture integrating Tabs & Drawers. |
| **Firebase Auth** | Managing remote remote user states, forgotten password workflows, and Re-Auth configurations natively. |
| **Firestore Database** | A NoSQL real-time document listener pulling remote datasets scaling without complex backend hosting. |
| **Expo Secure Store** | High-level data encryption wrapper preventing raw-string storage bugs allowing physical device biometrics interactions natively. | 

---

## 🚀 Installation & Build

### Prerequisites
- Ensure you have **Node.js** (v18+) and **npm** installed on your system.
- An actively configured Firebase Application (Web config block). *Make sure Authentication & Firestore is actively initialized.*

### Step 1. Clone & Install
```bash
git clone [YOUR_REPO_URL]
cd FitnessTracker
npm install
```

### Step 2. Start the Metro Bundler
Boot up your application in development configuration locally!
```bash
npx expo start -c
```
*(Passing the `-c` flag guarantees an initial clean slate parsing newly injected plugins fully natively!)*

### Step 3. Launching
- To run natively on your **iPhone** / **Android**, download **Expo Go** actively from your App/Play store natively and utilize the camera functionality hovering over the QR code rendering inside the Metro terminal.
- Alternatively, tap `i` or `a` respectively if building via an active Xcode/Android Studio Emulator properly configured natively!

---

## 📸 Functionality Highlights

**Auth Flow & Password Restoration** 
Instead of complex backend emails, the "Forgot Password" invokes custom Firebase triggers issuing standard payload tickets right to the mailbox flawlessly automatically.

**Changing Passwords & Re-Authenticating**
Unlike standard database loops, changing a password in the Side-Drawer natively invokes an `EmailAuthProvider` mechanism demanding accurate **Current Password** typing sequentially preventing external overrides natively accurately. 

---

*Authored by Yusuf Babatunde Muftaudeen (Dev. Progress)*