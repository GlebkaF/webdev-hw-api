
# 📘 Fitness App API

REST API для фитнес-приложения.

## 🌐 Базовый URL

```
/api/fitness
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

Регистрация нового пользователя.

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
  "token": "JWT токен"
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
  "token": "JWT токен"
}
```

---

### `GET /api/users/me`

Основные данные пользователя.

#### ✅ Response

```json
{
  "email": "user@example.com",
  "selectedCourses": ["idcourse1"]
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
    "directions": [],
    "fitting": [],
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
  "nameEN": "Yoga",
  "description": "...",
  "directions": [],
  "fitting": [],
  "workouts": ["17oz5f", "x8abc2"]
}
```

---

### `GET /api/courses/[id]/workouts`

Получить список тренировок курса.

#### ✅ Response

```json
[
  {
    "_id": "a1rqtt",
    "name": "Урок 2. Основные движения",
    "video": "https://www.youtube.com/embed/gJPs7b8SpVw",
    "exercises": [],
  },
]
```

---

## 🏋️ Workouts

### `GET /api/workouts/[id]`

Получить данные по тренировке.

#### ✅ Response

```json
{
  "_id": "a1rqtt",
  "name": "Урок 2. Основные движения",
  "video": "https://www.youtube.com/embed/gJPs7b8SpVw",
  "exercises": [
    {
      "name": "Крендель (15 повторений)",
      "quantity": 15,
      "_id": "687d11f5faa133228adcafc3"
    },
  ]
}
```

---

## 📈 Progress

### `POST /api/users/me/courses`

Добавить курс для пользователя.

#### 🔸 Body

```json
{
  "courseId": "id",
}
```

#### ✅ Response

```json

{
  "message": "Курс успешно добавлен!"
}
```

---

### `DELETE /api/users/me/courses/[id]`

Удалить курс у пользователя.

#### ✅ Response

```json

{
  "message": "Курс успешно удален!"
}
```

---

### `GET /api/users/me/progress?id={workoutID}`

Получить прогресс пользователя по тренировке.
`progressData` - число повторений для каждого упражнения

#### ✅ Response

```json
[
  {
    "workoutId": "pyvaec",
    "progressData": [1, 2, 3]
  }
]
```

---

### `POST /api/users/me/progress`

Сохранить прогресс тренировки.

#### 🔸 Body

```json
{
  "workoutId": "17oz5f",
  "progressData": [10, 10, 15]
}
```

#### ✅ Response

```json
{
  "message": "Прогресс по данной тренировке отмечен!"
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
  "message": "Пояснение ошибки"
}
```
