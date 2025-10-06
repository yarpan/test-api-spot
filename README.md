# Spotify API Testing with Playwright

Цей проект використовує Playwright для тестування Spotify Web API. Нижче наведена покрокова інструкція для налаштування автентифікації та отримання токенів доступу.

## Передумови

1. **Spotify Developer Account**: Потрібний акаунт розробника на [Spotify for Developers](https://developer.spotify.com/)
2. **Node.js**: Встановлений Node.js версії 14 або вище
3. **ngrok**: Для створення публічного URL для callback (можна встановити через `npm install -g ngrok`)

## Крок 1: Створення Spotify App

1. Перейдіть на [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Натисніть "Create app"
3. Заповніть форму:
   - **App name**: Ваша назва додатку
   - **App description**: Опис додатку
   - **Website**: Можна залишити порожнім або вказати localhost
   - **Redirect URIs**: `http://localhost:8888/callback` (буде оновлено пізніше)
   - **API/SDKs**: Виберіть "Web API"
4. Прийміть умови та створіть додаток
5. Збережіть `Client ID` та `Client Secret` з налаштувань додатку

## Крок 2: Налаштування ngrok

1. Встановіть ngrok:

   ```bash
   npm install -g ngrok
   ```

2. Запустіть ngrok для порту 8888:

   ```bash
   ngrok http 8888
   ```

3. Скопіюйте HTTPS URL (наприклад: `https://abc123.ngrok-free.app`)

4. Оновіть Redirect URI у вашому Spotify App:
   - Поверніться до Spotify Developer Dashboard
   - Відкрийте налаштування вашого додатку
   - Замініть Redirect URI на: `https://your-ngrok-url.ngrok-free.app/callback`
   - Збережіть зміни

## Крок 3: Налаштування Environment Variables

1. Створіть файл `.env` у корені проекту:

   ```env
   # Spotify App credentials
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here

   # Callback URL (ваш ngrok URL)
   REDIRECT_URL=https://your-ngrok-url.ngrok-free.app/callback


   # Authorization code (буде отримано на наступному кроці)
   AUTHORIZATION_CODE=
   ```

## Крок 4: Отримання Authorization Code

### Автоматичний (використовуючи callback server)

1. Запустіть callback server:

   ```bash
   npm start
   ```

2. У іншому терміналі запустіть helper для генерації auth URL:

   ```bash
   node helper/generateAuthUrl.js
   ```

   або зробіть її самостійно, підставивиши свої client_id і свій redirect_uri замість ...

   ```
   https://accounts.spotify.com/en/authorize?response_type=code&client_id=...&scope=playlist-modify-public+user-library-modify+user-library-read+playlist-modify-private+playlist-read-private+user-read-private+user-read-email&redirect_uri=...
   ```

3. Скопіюйте згенерований URL та відкрийте його в браузері
4. Увійдіть у свій Spotify акаунт та дайте дозволи
5. Після редиректу authorization code буде відображений на сторінці
6. Скопіюйте код та додайте його до `.env` файлу як `AUTHORIZATION_CODE`

## Крок 5: Отримання Access Token

1. Переконайтеся, що `AUTHORIZATION_CODE` додано до `.env` файлу
2. Запустіть helper для отримання токенів:

   ```bash
   node helper/authHelper.mjs
   ```

3. Цей скрипт:
   - Відправить POST запит до Spotify Token API
   - Отримає access_token, refresh_token та інші дані
   - Збереже токени у файл `tokens.json`

## Крок 6: Запуск тестів

Тепер ви можете запускати тести Spotify API:

```bash
# Запустити всі тести Spotify
npx playwright test

# Запустити конкретний тест
npx playwright test tests/playlist.spec.ts

# Запустити тести з репортом
npx playwright test --reporter=html
```
