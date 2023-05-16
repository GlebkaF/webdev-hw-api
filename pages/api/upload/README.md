# Документация API “Загрузка файлов”

## Загрузить картинку в облако

Позволяет загрузить картинку до 5 мегабайт в облако.

адрес: https://webdev-hw-api.vercel.app/api/upload/image

метод: POST

В теле запроса принимает файл в формате form data. Пример запроса

```js
// <input type="file" id="image-input" />
const fileInputElement = document.getElementById("image-input");
postImage({ file: fileInputElement.files[0] });

function postImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data.fileUrl);
    });
}
```

Возвращает статус код 200 и ссылку на файл:

```json
{
  "success": true,
  "fileUrl": "https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680517436469-loading.gif"
}
```
