require('dotenv').config();

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB ?? "webdev-hw-api";

mongoose.connect(MONGODB_URI, {
  dbName: MONGODB_DB,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    match: /^.+@.+\..+$/,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  selectedCourses: [
    {
      type: String,
      ref: "fitness_courses", // можно populate()
    },
  ],
  workoutProgress: [
    {
      workoutId: { type: String, ref: "fitness_workout" },
      progressData: [
        { 
          type: Number
        }
      ]
    }
  ]
}, {
  timestamps: true, // createdAt и updatedAt
});

const User = mongoose.model("fitness_users", userSchema);

const courseSchema = new mongoose.Schema({
  _id: String,
  description: String,
  directions: [String],
  fitting: [String],
  nameEN: String,
  nameRU: String,
  order: Number,
  workouts: [{ type: String, ref: "fitness_workouts" }],
});

const Course = mongoose.model("fitness_courses", courseSchema);

const workoutSchema = new mongoose.Schema({
  _id: String,
  name: String,
  video: String,
  exercises: [
    {
      name: String,
      quantity: Number,
    },
  ],
});

const Workout = mongoose.model("fitness_workouts", workoutSchema);

const coursesData = {
  "6i67sm": {
    "_id": "6i67sm",
    "description": "направление фитнеса, основанное на наборе аэробных упражнений, выполняемых с помощью специальной ступеньки (степ-платформы). Данное направление было разработано в 1989 году Джиной Миллер: травмировав колено, она обратилась к различным методикам восстановления сустава, но наибольший эффект показали простые упражнения в виде шагов на молочном ящике. Впоследствии эти упражнения Миллер положила в основу целого комплекса, который и стал называться степ-аэробикой. Занятия степ-аэробикой состоят из комплексов в виде различного сочетания шагов, выполняемые под музыку с довольно высоким темпом. Каждое занятие длится от 30 до 50 минут в достаточно высоком темпе без остановок на отдых – для передышки используются переходы на простые шаги и наиболее простые упражнения. Такой режим тренировок приводит к эффективному сжиганию калорий, укреплению суставов и общему улучшению состояния здоровья, что и стало основой высокой популярности нового направления.",
    "directions": ["Для начинающих", "Для похудения", "Для детей"],
    "fitting": [
      "Хотите укрепить дыхательную и сердечно-сосудистой системы",
      "Быстрый сбросить лишние килограммы",
      "Улучшить настроение, повысить жизненный тонус"
    ],
    "nameEN": "StepAirobic",
    "nameRU": "Степ-аэробика",
    "order": 4,
    "workouts": ["e9ghsb", "a1rqtt", "mstcbg", "t3cpno"]
  },
  "ab1c3f": {
    "_id": "ab1c3f",
    "description": "это философия здорового образа жизни. Тот, кто занимается йогой, становится здоровее и выносливее, после занятий чувствует прилив сил, а также с новой силой может ощутить вкус к жизни.  Благодаря комплексному воздействию упражнений происходит проработка всех групп мышц, тренировка суставов, улучшается циркуляция крови. Кроме того, упражнения дарят отличное настроение, заряжают бодростью и помогают противостоять стрессам.",
    "directions": [
      "Йога для новичков",
      "Классическая йога",
      "Йогатерапия",
      "Кундалини-йога",
      "Хатха-йога",
      "Аштанга-йога"
    ],
    "fitting": [
      "Давно хотели попробовать йогу, но не решались начать",
      "Хотите укрепить позвоночник, избавиться от болей в спине и суставах",
      "Ищете активность, полезную для тела и души"
    ],
    "nameEN": "Yoga",
    "nameRU": "Йога",
    "order": 1,
    "workouts": ["3yvozj", "hfgxlo", "kcx5ai", "kt6ah4", "mrhuag"]
  },
  "kfpq8e": {
    "_id": "kfpq8e",
    "description": "это система упражнений, целью которых является разогрев и растяжка мышц и связок. При этом стретчинг – не просто комплекс упражнений для разминки перед тренировкой, а самостоятельное направление фитнеса, которое может использоваться как в комплексе с другими направлениями, так и самостоятельно. Стретчинг в домашних условиях может использоваться для многих целей: ● Выступает в качестве гимнастики в период восстановления после травм; ● Входит в состав программы для похудения; ● Помогает развить гибкость и пластичность, при правильном подходе вы сядете на шпагат через несколько недель; ● Это эффективный способ расслабиться после трудного дня.",
    "directions": ["статический", "динамический", "пассивный", "активный"],
    "fitting": [
      "Улучшить осанку и координацию",
      "Хотите подтянуть тело, смоделировать мышечный корсет",
      "Улучшить кровообращение и обмен веществ"
    ],
    "nameEN": "Stretching",
    "nameRU": "Стретчинг",
    "order": 2,
    "workouts": ["9mefwq", "9yolz2", "pi5vtr"]
  },
  "q02a6i": {
    "_id": "q02a6i",
    "description": "BodyFlex – система, в которой особым образом сочетаются физические упражнения на укрепление и растяжку мышц, и дыхательная гимнастика. Такое сочетание приводит к ряду положительных эффектов, которые практически невозможно достичь с помощью других направлений фитнеса. Одна из самых интересных особенностей данной системы заключается в том, что это эффективный фитнес дома. Весь смысл бодифлекса сводится к правильному дыханию, благодаря которому упражнения на растяжку и укрепление мышц приобретают свою эффективность. При выдыхании воздуха и задержке дыхания организм на короткое время испытывает кислородное голодание, в крови накапливается углекислый газ, что приводит к запуску некоторых физиологических процессов, типичных для ситуации «бей или беги». То есть, организм приходит в состояние повышенной готовности и способен выполнять быстрые и энергичные действия.",
    "directions": ["базовый", "продвинутый"],
    "fitting": [
      "Хотите укрепить легкие и снизить вероятность заболеваний дыхательной системы",
      "Улучшить пищеварение",
      "Ускорить метаболизм"
    ],
    "nameEN": "BodyFlex",
    "nameRU": "Бодифлекс",
    "order": 5,
    "workouts": ["xlpkqy", "17oz5f", "pyvaec"]
  },
  "ypox9r": {
    "_id": "ypox9r",
    "description": "Фитнес и танцы – что между ними общего? А то, что они могут великолепно сочетаться и оказывать просто восхитительный эффект на ваше тело! Объединение хореографии и аэробики – это необычно и интересно, именно так родился танцевальный фитнес, которым вы теперь можете заниматься дома. Достичь отличной формы и при этом получить удовольствие вам поможет видео для похудения, которое мы представляем на этой странице – делайте упражнения, танцуйте и чувствуйте, как ваше тело меняется в лучшую сторону!",
    "directions": ["Зумба", "Dance-mix", "Caribbean-mix"],
    "fitting": [
      "Хотите укрепить мышцы, но тренировки в тренажерном зале для вас скучные и однообразные",
      "Хотите сбросить лишний вес, но нет желания мучать себя диетами",
      "Любите танцы и хотите совместить приятное с полезным."
    ],
    "nameEN": "DanceFitness",
    "nameRU": "Танцевальный фитнес",
    "order": 3,
    "workouts": ["gh7bd5", "hwsut5", "n18r8v", "dq9rzo", "rr70ie"]
  }
};

const workoutData = {
  "17oz5f": {
    "_id": "17oz5f",
    "exercises": [
      {
        "name": "Ножницы горизонтальные (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Ножницы вертикальные (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Шлюпка (15 повторений)",
        "quantity": 15
      }
    ],
    "name": "Тренировка мышц бедер",
    "video": "https://www.youtube.com/embed/zxaoes0JQ5g"
  },
  "3yvozj": {
    "_id": "3yvozj",
    "exercises": [
      {
        "name": "Приветствие солнца (10 повторений)",
        "quantity": 10
      }
    ],
    "name": "Утренняя практика / Йога на каждый день / 1 день / Алексей Казубский",
    "video": "https://www.youtube.com/embed/oqe98Dxivns"
  },
  "9mefwq": {
    "_id": "9mefwq",
    "exercises": [
      {
        "name": "Правильное дыхание (20 повторений)",
        "quantity": 20
      },
      {
        "name": "Наклон вниз, правая рука тянется вверх (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Наклон вниз, левая рука тянется вверх (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Перенос веса с ноги на ногу в положении сидя (20 повторений)",
        "quantity": 20
      }
    ],
    "name": "Основы стретчинга",
    "video": "https://www.youtube.com/embed/Ewm-Bfg5ncg"
  },
  "9yolz2": {
    "_id": "9yolz2",
    "exercises": [
      {
        "name": "Перекрестные взмахи руками (15 повторений)",
        "quantity": 15
      },
      {
        "name": "Собака мордой вверх (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Скручивание лежа (5 повторений)",
        "quantity": 5
      }
    ],
    "name": "Разогрев мышц",
    "video": "https://www.youtube.com/embed/IISxKE3LGSE"
  },
  "a1rqtt": {
    "_id": "a1rqtt",
    "name": "Урок 2. Основные движения",
    "video": "https://www.youtube.com/embed/gJPs7b8SpVw"
  },
  "dq9rzo": {
    "_id": "dq9rzo",
    "name": "Урок 4. Продвинутые движения",
    "video": "https://www.youtube.com/embed/3RPauxe4SeE"
  },
  "e9ghsb": {
    "_id": "e9ghsb",
    "name": "Урок 1. Основы",
    "video": "https://www.youtube.com/embed/oK2mdodtPY4"
  },
  "gh7bd5": {
    "_id": "gh7bd5",
    "name": "Урок 1. Основы",
    "video": "https://www.youtube.com/embed/x6_8ZEYXPak"
  },
  "hfgxlo": {
    "_id": "hfgxlo",
    "exercises": [
      {
        "name": "Наклон вперед (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Наклон назад (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Поднятие ног, согнутых в коленях (5 повторений)",
        "quantity": 5
      }
    ],
    "name": "Красота и здоровье / Йога на каждый день / 2 день / Алексей Казубский",
    "video": "https://www.youtube.com/embed/v-xTLFDhoD0"
  },
  "hwsut5": {
    "_id": "hwsut5",
    "name": "Урок 2. Основные движения",
    "video": "https://youtu.be/embed/UjVtcMD4On4"
  },
  "kcx5ai": {
    "_id": "kcx5ai",
    "exercises": [
      {
        "name": "Наклон к правой ноге (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Наклон к левой ноге (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Наклон к согнутой правой ноге (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Наклон к согнутой левой ноге (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Асана стоя (5 повторений)",
        "quantity": 5
      }
    ],
    "name": "Асаны стоя / Йога на каждый день / 3 день / Алексей Казубский",
    "video": "https://www.youtube.com/embed/WxFz-4YsiEE"
  },
  "kt6ah4": {
    "_id": "kt6ah4",
    "exercises": [
      {
        "name": "Сесть на пятки с носками от себя (5 повторений)",
        "quantity": 5
      },
      {
        "name": "Сесть на пятки с носками на себя (5 повторений)",
        "quantity": 5
      },
      {
        "name": "Отпустить колено на пол из позы лотоса (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Отпустить колено на пол из позы лотоса с соединенными стопами (10 повторений)",
        "quanity": 10
      }
    ],
    "name": "Растягиваем мышцы бедра / Йога на каждый день / 4 день / Алексей Казубский",
    "video": "https://www.youtube.com/embed/09uGkAEQuZI"
  },
  "mrhuag": {
    "_id": "mrhuag",
    "exercises": [
      {
        "name": "Округляем грудную клетку при выдохе (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Тянем левую руку в правую сторону (20 повторений)",
        "quantity": 20
      },
      {
        "name": "Тянем правую руку в левую сторону (20 повторений)",
        "quantity": 20
      }
    ],
    "name": "Гибкость спины / Йога на каждый день / 5 день / Алексей Казубский",
    "video": "https://www.youtube.com/embed/MIvcMapie_A"
  },
  "mstcbg": {
    "_id": "mstcbg",
    "name": "Урок 3. Новые движения",
    "video": "https://www.youtube.com/embed/PGAQfXIAY7k"
  },
  "n18r8v": {
    "_id": "n18r8v",
    "name": "Урок 3. Новые движения",
    "video": "https://www.youtube.com/embed/gvL27uHhKz4"
  },
  "pi5vtr": {
    "_id": "pi5vtr",
    "exercises": [
      {
        "name": "Поперечная складка вперед (15 повторений)",
        "quantity": 15
      },
      {
        "name": "Поза ребенка (5 повторений)",
        "quantity": 5
      },
      {
        "name": "Растяжка трицепсов и плеч (20 повторений)",
        "quantity": 20
      }
    ],
    "name": "Разогрев мышц 2.0",
    "video": "https://www.youtube.com/embed/HKB89EIJ2J0"
  },
  "pyvaec": {
    "_id": "pyvaec",
    "exercises": [
      {
        "name": "Крендель (15 повторений)",
        "quantity": 15
      },
      {
        "name": "Собачка (20 повторений)",
        "quantity": 20
      },
      {
        "name": "Кошка (15 повторений)",
        "quantity": 15
      }
    ],
    "name": "Тренировка мышц ягодиц",
    "video": "https://www.youtube.com/embed/JTCaG3Y9xlM"
  },
  "rr70ie": {
    "_id": "rr70ie",
    "name": "Урок 5. Мастер-класс",
    "video": "https://www.youtube.com/embed/_78_OGLyy9Y"
  },
  "t3cpno": {
    "_id": "t3cpno",
    "name": "Урок 4. Продвинутые движения",
    "video": "https://www.youtube.com/embed/zuBLSarZuyk"
  },
  "xlpkqy": {
    "_id": "xlpkqy",
    "exercises": [
      {
        "name": "Отведение рук назад (20 повторений)",
        "quantity": 20
      },
      {
        "name": "Боковая растяжка (10 повторений)",
        "quantity": 10
      },
      {
        "name": "Простой пресс (20 повторений)",
        "quantity": 20
      }
    ],
    "name": "Техника дыхания",
    "video": "https://www.youtube.com/embed/HruMFn74NII"
  }
}

export async function seedDatabase() {
  try {
    await User.createCollection();
    // await User.deleteMany({}); // add only if needed
    // clear old data if any
    await Course.deleteMany({});
    await Workout.deleteMany({});

    const workouts = Object.values(workoutData);
    const courses = Object.values(coursesData);
    await Workout.insertMany(workouts)
    await Course.insertMany(courses);

    console.log("Данные успешно добавлены в БД!");
  } catch (error) {
    console.error("Ошибка при добавлении данных:", error);
  } finally {
    mongoose.connection.close();
  }
}

// seedDatabase();
