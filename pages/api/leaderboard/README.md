# Документация API “Лидерборд”

## Получить список лидеров

адрес: https://wedev-api.sky.pro/api/leaderboard

метод: GET

Возвращает статус код 200 и отсортированный по возрастанию времени игры список лидеров в формате JSON, например:

```json
{
  "leaders": [
    { "id": 1, "name": "Великий маг", "time": 8 },
    { "id": 2, "name": "Карточный мастер", "time": 12 },
    { "id": 3, "name": "Гениальный игрок", "time": 31 }
  ]
}
```

## Добавить лидера в список

адрес: https://wedev-api.sky.pro/api/leaderboard

метод: POST

Принимает данные лидера, описанного в формате JSON, например:

```json
{ "name": "Великий маг 2", "time": 8 }
```

Если имя не было введено, то по умолчанию устанавливается значение "Пользователь". 

Возвращает статус код 201 и обновленный список лидеров, например:

```json
{
  "leaders": [
    { "id": 1, "name": "Великий маг", "time": 8 },
    { "id": 2, "name": "Карточный мастер", "time": 12 },
    { "id": 3, "name": "Гениальный игрок", "time": 31 },
    { "id": 4, "name": "Великий маг 2", "time": 33 }
  ]
}
```

Возвращает статус код 400, если полученные данные не в формате JSON