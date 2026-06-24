import { connectToMongoose } from "@/libs/onlineStore";
import { Product } from "@/model/onlineStore/schema";

const colorsList = [
    "Белый", "Черный", "Серый", "Красный", "Оранжевый", "Желтый",
    "Зеленый", "Салатовый", "Голубой", "Синий", "Фиолетовый",
    "Сиреневый", "Лавандовый", "Розовый"
];

const roomTypesList = [
    "Кухня и столовая", "Ванная комната", "Детская комната",
    "Домашний офис", "Гостиная", "Прихожая", "Спальня",
    "Гардероб", "Дача", "Свет"
];

function randomFromArray(arr, min = 1, max = 4) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Данные товаров (15 штук: 3 спецпредложения + 12 каталога)
const productsData = [
    // Спецпредложения (isSpecial: true)
    {
        name: "Кровать TATRAN",
        description: "Основание из полированной нержавеющей стали, придает оригинальный парящий эффект.",
        price: 120000,
        oldPrice: 140000,
        image: "https://drive.google.com/uc?export=view&id=12UhKP53wkqMLt0UQgCXoQR0B9uXa7asC",
        isSpecial: true,
    },
    {
        name: "Кресло VILORA",
        description: "Мягкое и уютное, аккуратное и стильное. Упругие подушки сиденья и приятная на ощупь ткань.",
        price: 21000,
        oldPrice: 28000,
        image: "https://drive.google.com/uc?export=view&id=1O6o6x6hXHrK2YSE3LUT4aj7OhADbGF4-",
        isSpecial: true,
    },
    {
        name: "Стол MENU",
        description: "Европейский дуб - отличается особой прочностью и стабильностью.",
        price: 34000,
        oldPrice: 45000,
        image: "https://drive.google.com/uc?export=view&id=1q5whbduRqm5D49el680_jqQJI_4fj3gi",
        isSpecial: true,
    },
    // Обычные товары (каталог) – 12 штук
    {
        name: "Диван ASKESTA",
        description: "Благодаря защелкивающемуся механизму диван легко раскладывается в комфортную кровать",
        price: 68000,
        image: "https://drive.google.com/uc?export=view&id=16FSVJLWs7T3qellmq2zM7Z5_36hIuEdm",
    },
    {
        name: "Кресло LUNAR",
        description: "Прекрасно переносит солнечные лучи, перепады влажности и любые осадки",
        price: 40000,
        image: "https://drive.google.com/uc?export=view&id=16l6T9jy_owQRaIe9WSPEzA1z8drUsnn5",
    },
    {
        name: "Шкаф Nastan",
        description: "Мебель может быть оснащена разнообразными системами подсветки.",
        price: 80000,
        image: "https://drive.google.com/uc?export=view&id=1EWp1xy_q_8k3xgwA5RMYHRf6lzNnXiil",
    },
    {
        name: "Комод Modern",
        description: "Стильный комод с выдвижными ящиками и фрезерованными фасадами.",
        price: 45000,
        image: "https://drive.google.com/uc?export=view&id=1I1IGTn1ZO12k5ZuyxhfCy710hd7vAn0B",
    },
    {
        name: "Тумба прикроватная",
        description: "Компактная тумба из натурального дерева с мягким закрыванием ящиков.",
        price: 25000,
        image: "https://drive.google.com/uc?export=view&id=1JTD4SAJKVYrnpLjmbjW7GKG7WleGh1Qy",
    },
    {
        name: "Полка настенная",
        description: "Надёжная полка для книг и декора, выдерживает до 30 кг.",
        price: 12000,
        image: "https://drive.google.com/uc?export=view&id=1QYsNCk6BhSQpbEcna2nT0oiBOnld_Hul",
    },
    {
        name: "Зеркало в раме",
        description: "Большое настенное зеркало в деревянной раме с эффектом состаривания.",
        price: 18000,
        image: "https://drive.google.com/uc?export=view&id=1SKY4lvhCp6-Wu7U0h6NVma5O66bHwinf",
    },
    {
        name: "Стул обеденный",
        description: "Прочный стул на гнутых ножках, обивка из экокожи.",
        price: 15000,
        image: "https://drive.google.com/uc?export=view&id=1kIUUNuoaPHX5FZ6MiUYkLhmBwerdZFQM",
    },
    {
        name: "Табурет",
        description: "Деревянный табурет с мягким сиденьем, подходит для кухни.",
        price: 9000,
        image: "https://drive.google.com/uc?export=view&id=1q4RKc8r5bhVw5FZdMeIBU6CnvaO1em_g",
    },
    {
        name: "Вешалка напольная",
        description: "Металлическая вешалка с крючками и полкой для обуви.",
        price: 22000,
        image: "https://drive.google.com/uc?export=view&id=1wMCfrTCpnu7ELTGqb6sm-7fyM_63mI-a",
    },
    {
        name: "Пуф мягкий",
        description: "Круглый пуф с велюровой обивкой, используется как сиденье или подставка.",
        price: 11000,
        image: "https://drive.google.com/uc?export=view&id=1yAiC0DcgvTikhhqIXo58j9f1ymsGmJK4",
    },
    {
        name: "Журнальный столик",
        description: "Стеклянный столик на металлическом каркасе с полкой для журналов.",
        price: 32000,
        image: "https://drive.google.com/uc?export=view&id=1zHUHC0g-Dip6rg8pnzEPcS7Hmh7blgEh",
    },
];

export async function seedOnlineStore() {
    await connectToMongoose();

    // Проверяем, есть ли уже товары
    const count = await Product.countDocuments();
    if (count > 0) {
        console.log("Миграция уже выполнена, товаров в базе:", count);
        return { success: false, message: `Миграция уже выполнена. Товаров: ${count}` };
    }

    // Подготавливаем каждый товар: добавляем случайные цвета, комнаты, срок доставки, популярность
    const products = productsData.map((item) => {
        const colors = randomFromArray(colorsList, 1, 4);
        const roomTypes = randomFromArray(roomTypesList, 1, 2);
        const deliveryDays = randomInt(3, 21);
        const popularity = randomInt(0, 1000);

        return {
            ...item,
            colors,
            roomTypes,
            deliveryDays,
            popularity,
            createdAt: new Date(),
            oldPrice: item.oldPrice || null,
        };
    });

    await Product.insertMany(products);
    console.log("Добавлено товаров:", products.length);
    return { success: true, message: `База успешно заполнена ${products.length} товарами` };
}