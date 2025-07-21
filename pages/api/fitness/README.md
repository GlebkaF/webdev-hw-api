
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

### `POST /api/fitness/auth/register`

Регистрация нового пользователя. Email должен быть корректным. 

Требования к паролю:
1. Не менее 6 символов
2. Не менее двух спецсимволов
3. Не менее одной заглавной буквы

#### 🔸 Body

```json
{
  "email": "user@example.com",
  "password": "Secure@!"
}
```

#### ✅ Response

```json
{
  "message": "Регистрация прошла успешно!"
}
```

#### ❌ Response errors (404)

```json
{
  "message": "Error message"
}
```

Ошибки Email:
1. "Введите корректный Email" - Переданное значение в поле email не соответствует формату Email
2. "Пользователь с таким email уже существует"

Ошибки пароля:
1. "Пароль должен содержать не менее 6 симоволов"
2. "Пароль должен содержать не менее 2 спецсимволов"
3. "Пароль должен содержать как минимум одну заглавную букву"

---

### `POST /api/fitness/auth/login`

Авторизация пользователя.

#### 🔸 Body

```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```

#### ✅ Response

**JWT токен действует 7 дней с момента регистрации!**

```json
{
  "token": "JWT токен"
}
```

#### ❌ Response errors (404)

```json
{
  "message": "Error message"
}
```

1. "Пользователь с таким email не найден"
2. "Неверный пароль"

---

### `GET /api/fitness/users/me` *

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

### `GET /api/fitness/courses`

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

### `GET /api/fitness/courses/[id]`

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

### `GET /api/fitness/courses/[id]/workouts` *

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

### `POST /api/fitness/users/me/courses` *

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

### `DELETE /api/fitness/users/me/courses/[id]` *

Удалить курс у пользователя.

#### ✅ Response

```json

{
  "message": "Курс успешно удален!"
}
```

---

## 🏋️ Workouts

### `GET /api/fitness/workouts/[id]` *

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

### `GET /api/fitness/users/me/progress?id={workoutID}` *

Получить прогресс пользователя по тренировке.

`progressData` - число повторений для каждого упражнения. Длина массива progressData должна совпадать с количеством упражнений в тренировке. 

Например, в случае если необходимо заполнить прогресс только по третьему упражнению из четырех, необходимо передать `[0, 0, 10, 0]`. 

В случае, если прогресс по остальным упражнениям уже был, необходимо указать его без изменений. Например, было `[1, 7, 0, 10]`. Мы хотим записать 5 повторений третьего упражнения. Нужно передать `[1, 7, 5, 10]`.

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

### `POST /api/fitness/users/me/progress` *

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

Звёздочкой* помечены endpoints, требующие токена авторизации. Используется метод Bearer:

```
Authorization: Bearer <token>
```

---

## ❌ Errors

Все ошибки возвращаются в формате:

```json
{
  "message": "Пояснение ошибки"
}
```
