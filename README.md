# Рандеву (Rendez-vous) - Инструкция по развертыванию

## 1. Настройка Firebase
1. Создайте проект в [Firebase Console](https://console.firebase.google.com/).
2. Включите **Authentication** (провайдер: Email/Password).
3. Включите **Firestore Database** и **Storage**.
4. Скопируйте конфигурацию приложения и вставьте её в файл `scripts/config/firebase.js`.

## 2. Правила безопасности Firestore
Перейдите в настройки Firestore -> вкладка Rules и вставьте этот код:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Пользователи: читать могут все авторизованные, писать - только владелец
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    // Лайки: создавать/читать могут авторизованные, обновлять - владелец документа
    match /likes/{likeId} {
      allow read, create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.fromUid;
    }
    // Чаты и сообщения: только участники (participants)
    match /chats/{chatId} {
      allow read, write: if request.auth != null && request.auth.uid in resource.data.participants;
      match /messages/{messageId} {
        allow read, write: if request.auth != null && request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
      }
    }
  }
}