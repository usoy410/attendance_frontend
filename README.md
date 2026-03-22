# Chronicle Of Attendance (CCS Attendance) 📅

A modern, fast, and secure attendance tracking system built for the CCS department. This mobile application allows for seamless event management and real-time attendance tracking via QR codes.

## 🚀 Key Features

-   **Secure Authentication**: Role-based access for students and administrators.
-   **QR Code Scanner**: High-speed check-in/check-out for events.
-   **Event Management**: Create, update, and manage departmental events with ease.
-   **Session Tracking**: Support for multiple sessions (Morning/Afternoon) per event.
-   **Real-time Attendance**: Instantly see who's present and who's missing.
-   **Responsive Design**: Optimized for both iOS and Android devices.

## 🛠️ Tech Stack

-   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
-   **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
-   **UI Components**: Custom components, [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/), [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
-   **Camera/QR**: [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
-   **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🏁 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [Expo Go](https://expo.dev/go) app (for physical device testing)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/usoy410/attendance_frontend.git
    cd attendance_frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the application**:
    ```bash
    npx expo start
    ```

4.  **Open the app**:
    -   Scan the QR code in your terminal with the **Expo Go** app (Android) or the **Camera** app (iOS).
    -   Press `a` for Android Emulator.
    -   Press `i` for iOS Simulator.

## 📁 Project Structure

-   `app/`: Main application routes and screens (using Expo Router).
-   `components/`: Reusable UI components (Modals, Cards, Forms).
-   `hooks/`: Custom React hooks for data fetching and logic.
-   `utils/`: Utility functions and helper methods.
-   `constants/`: Shared constants and configuration.
-   `assets/`: Images, icons, and fonts used in the app.

## 📝 Scripts

-   `npm start`: Start the Expo development server.
-   `npm run android`: Run the app on an Android device/emulator.
-   `npm run ios`: Run the app on an iOS simulator.
-   `npm run web`: Open the app in a web browser.
-   `npm run lint`: Run ESLint to check for code issues.

## 🤝 Contributing

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---
Built with ❤️ for the CCS Community.
