# Документация API "Words"

Все API работают с авторизацией:
- Авторизация по Bearer токену: передайте в заголовке Authorization пользовательский токен `"Bearer ksdfsksdfjfsdjk"`. Токен можно получить в [API авторизации](../user/README.md).

Запросы без авторизации возвращают **401** статус ответа.

---

## Получить список слов

**Адрес:**  
`https://wedev-api.sky.pro/api/words`

**Метод:**  
`GET`

**Ответ:**  
Возвращает статус **200** и список слов в формате JSON:

```json
{
  "words": [
    {
      "_id": "659ad0aad0e154bebca2b6b3",
      "userId": "659abd3ad0e154bebca2b6b7",
      "name": "apple",
      "translation": "яблоко",
      "status": "изучается",
      "deadline": "2024-03-01T00:00:00.000Z"
    },
    {
      "_id": "659ad0aad0e154bebca2b6bb",
      "userId": "659abd3ad0e154bebca2b6b7",
      "name": "car",
      "translation": "машина",
      "status": "выучено",
      "deadline": null
    }
  ]
}
```

---

## Получить слово по `id`

**Адрес:**  
`https://wedev-api.sky.pro/api/words/:id`

**Метод:**  
`GET`

**Ответ:**  
Возвращает статус **200** и данные слова в формате JSON:

```json
{
  "word": {
    "_id": "659ad0aad0e154bebca2b6b3",
    "userId": "659abd3ad0e154bebca2b6b7",
    "name": "apple",
    "translation": "яблоко",
    "status": "изучается",
    "deadline": "2024-03-01T00:00:00.000Z"
  }
}
```

Если слово не найдено, возвращает **404**.

---

## Добавить слово в список

**Адрес:**  
`https://wedev-api.sky.pro/api/words`

**Метод:**  
`POST`

**Тело запроса:**  
Передается JSON с данными нового слова:

```json
{
    "name": "banana",
    "translation": "банан",
    "status": "изучается",
    "deadline": "2024-04-01T00:00:00.000Z"
}
```

**Ответ:**  
Возвращает статус **201** и обновленный список слов.

---

## Изменить слово

**Адрес:**  
`https://wedev-api.sky.pro/api/words/:id`

**Метод:**  
`PUT`

**Тело запроса:**  
Передается JSON с обновленными данными:

```json
{
    "name": "banana",
    "translation": "банан",
    "status": "выучено",
    "deadline": null
}
```

**Ответ:**  
Возвращает статус **201** и обновленный список слов.

---

## Удалить слово

**Адрес:**  
`https://wedev-api.sky.pro/api/words/:id`

**Метод:**  
`DELETE`

**Ответ:**  
Возвращает статус **201** и обновленный список слов.
