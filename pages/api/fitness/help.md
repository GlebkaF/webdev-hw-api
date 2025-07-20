
# 📘 Fitness App API

REST API для фитнес-приложения на базе **Next.js API Routes** и **MongoDB (Mongoose)**.

## 🌐 Базовый URL

```
/api
```

При развертывании:  
```
https://your-domain.vercel.app/api
```

---

## 📋 Содержание

- [Users](#users)
- [Courses](#courses)
- [Workouts](#workouts)
- [Progress](#progress)
- [Authentication](#authentication)
- [Errors](#errors)

---

## 👤 Users

### `POST /api/users/register`

Создание нового пользователя.

#### 🔸 Body

```json
{
  "email": "user@example.com",
  "password": "secure123",
  "name": "Иван"
}
```

#### ✅ Response

```json
{
  "message": "Пользователь зарегистрирован",
  "userId": "user123"
}
```

---

### `POST /api/users/login`

Авторизация пользователя.

#### 🔸 Body

```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```

#### ✅ Response

```json
{
  "token": "jwt_token_here",
  "user": {
    "email": "user@example.com",
    "selectedCourses": []
  }
}
```

---

## 🎓 Courses

### `GET /api/courses`

Получить все курсы.

#### ✅ Response

```json
[
  {
    "_id": "ab1c3f",
    "nameRU": "Йога",
    "nameEN": "Yoga",
    "description": "...",
    "directions": [...],
    "fitting": [...],
    "workouts": ["17oz5f", "x8abc2"]
  }
]
```

---

### `GET /api/courses/[id]`

Получить один курс по ID.

#### ✅ Response

```json
{
  "_id": "ab1c3f",
  "nameRU": "Йога",
  ...
}
```

---

## 🏋️ Workouts

### `GET /api/workouts`

Получить список всех тренировок.

#### ✅ Response

```json
[
  {
    "_id": "17oz5f",
    "name": "Тренировка мышц бедер",
    "video": "https://www.youtube.com/embed/...",
    "exercises": [
      { "name": "Ножницы", "quantity": 10 }
    ]
  }
]
```

---

## 📈 Progress

### `GET /api/progress/[userId]`

Получить прогресс пользователя по его ID.

#### ✅ Response

```json
[
  {
    "workoutId": "17oz5f",
    "date": "2025-07-20T12:00:00.000Z",
    "exercisesCompleted": [10, 15, 8]
  }
]
```

---

### `POST /api/progress`

Сохранить прогресс тренировки.

#### 🔸 Body

```json
{
  "userId": "u12345",
  "workoutId": "17oz5f",
  "exercisesCompleted": [10, 10, 15],
  "date": "2025-07-20"
}
```

#### ✅ Response

```json
{
  "message": "Прогресс сохранён"
}
```

---

## 🔐 Authentication

Для защищённых маршрутов:

```
Authorization: Bearer <token>
```

---

## ❌ Errors

Ошибки возвращаются в формате:

```json
{
  "error": "Пояснение ошибки"
}
```
