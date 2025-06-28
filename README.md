# EmergencyFirstAidAIApp

Una aplicación móvil de React Native para asistencia médica de emergencia con guía de primeros auxilios asistida por IA.

## Descripción

EmergencyFirstAidAIApp es una aplicación móvil que proporciona instrucciones de primeros auxilios guiadas por voz durante emergencias médicas. La aplicación utiliza inteligencia artificial para interacciones de voz y está integrada con Firebase para la gestión de usuarios y almacenamiento de datos.

## Características Principales

- 🗣️ **Guía de voz con IA**: Instrucciones de primeros auxilios paso a paso usando Text-to-Speech y Speech-to-Text
- 🏥 **Categorías de emergencia**: Selección visual de tarjetas para diferentes tipos de emergencias
- 🔥 **Integración con Firebase**: Autenticación de usuarios, almacenamiento de datos y funciones en la nube
- 📞 **Llamadas de emergencia**: Funcionalidad de llamada directa al 110 (Bolivia)
- 📱 **Modo offline**: Capacidades básicas de guía de primeros auxilios sin conexión
- 📐 **Diseño responsivo**: Adaptable a diferentes tamaños de pantalla

## Categorías de Emergencia

- **Cortes y Heridas**: Atención inmediata para heridas y sangrado
- **Quemaduras**: Tratamiento para quemaduras leves y severas
- **Insolación**: Cuidados para golpe de calor e insolación
- **Atragantamiento**: Maniobra de Heimlich y liberación de vías respiratorias
- **Desmayo**: Atención para pérdida de consciencia
- **RCP**: Reanimación cardiopulmonar paso a paso

## Tecnologías Utilizadas

- **Frontend**: React Native con TypeScript
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions)
- **Integración de IA**: API externa para interacciones de voz
- **Procesamiento de voz**: React Native Voice, React Native TTS
- **Navegación**: React Navigation
- **Gestión de estado**: Context API

## Requisitos Previos

> **Nota**: Asegúrate de haber completado la [Guía de Configuración del Entorno](https://reactnative.dev/docs/set-up-your-environment) antes de continuar.

- Node.js (v14 o superior)
- React Native CLI
- Android Studio (para desarrollo Android)
- Xcode (para desarrollo iOS, solo macOS)

## Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd EmergencyFirstAidAIApp
```

2. Instala las dependencias:
```bash
npm install
```

3. Para iOS, instala los pods:
```bash
cd ios && pod install && cd ..
```

## Ejecución de la Aplicación

### Paso 1: Iniciar Metro

Primero, necesitarás ejecutar **Metro**, la herramienta de construcción JavaScript para React Native.

Para iniciar el servidor de desarrollo Metro, ejecuta el siguiente comando desde la raíz de tu proyecto React Native:

```bash
# Usando npm
npm start

# O usando Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
