
# 🚀 RicherDEV Build

Готовая фронтенд‑сборка для быстрой верстки сайтов, UI-систем и прототипов.  
Основана на **Pug**, **SCSS**, **Gulp** и **jQuery** — идеально подходит для верстальщиков и frontend-разработчиков.

---

## 📦 Стек технологий

| Инструмент    | Назначение                           |
|---------------|--------------------------------------|
| **Pug**       | Шаблонизатор HTML                    |
| **SCSS**      | Модульные стили с переменными и миксинами |
| **jQuery**    | Упрощённая работа с DOM и событиями  |
| **Gulp**      | Автоматизация сборки                 |
| **BrowserSync** | LiveReload при разработке          |

---

## 📁 Структура проекта

```
.
├── app/
│   ├── css/                # Скомпилированные CSS (main.min.css)
│   ├── fonts/Font/         # Подключаемые шрифты
│   ├── js/                 # Скрипты (в т.ч. jQuery)
│   │   ├── common.js       # Ваши скрипты (использует jQuery)
│   │   └── scripts.min.js  # Сборка минифицированных скриптов
│   ├── libs/               # Подключаемые библиотеки (в т.ч. jQuery)
│   ├── pug/                # Шаблоны Pug
│   │   ├── layout/         # Части интерфейса (header, footer)
│   │   ├── pages/          # Страницы (about.pug и др.)
│   │   ├── sample/         # Примеры/заготовки
│   │   ├── utils/          # Миксины и вспомогательные шаблоны
│   │   └── index.pug       # Главная страница
│   └── scss/               # SCSS стили
│       ├── base/           # fonts, reset, сторонние стили
│       ├── components/     # UI компоненты (buttons, fields)
│       ├── layout/         # header/footer и т.д.
│       ├── utils/          # Миксины, переменные, media
│       └── main.scss       # Главный файл-импортёр
├── index.html              # Скомпилированная главная страница
├── about.html              # Страница "О нас"
├── gulpfile.js             # Gulp конфигурация
├── package.json            # NPM зависимости
└── .gitignore
```

---

## ⚙️ Быстрый старт

### 1. Установка

```bash
git clone https://github.com/Mishka-Web/build.git
cd build
npm install
```

### 2. Запуск

```bash
gulp
```

Будет запущен Live-сервер с автоматической пересборкой:

- Pug → HTML
- SCSS → CSS (минифицировано)
- JS (включая jQuery) → scripts.min.js

---

## 🔁 Основные команды Gulp

| Команда        | Что делает                                 |
|----------------|--------------------------------------------|
| `gulp`         | Запуск полного процесса сборки и сервера   |
| `gulp deploy`  | Деплой исходных данных на сервер           |
| `gulp build`   | Сборка исходных файлов в `dist/`           |

---

## 🧩 Использование jQuery

Подключённая библиотека `jQuery` находится в `libs/` или импортируется через `node_modules` (если используется сборка).

Пример использования (в `common.js`):

```js
$(document).ready(function () {
  $('.menu-toggle').on('click', function () {
    $('.menu').toggleClass('active');
  });
});
```

jQuery автоматически включается в итоговый `scripts.min.js`.

---

## 📜 Примеры

Создание новой страницы:

```bash
app/pug/pages/contacts.pug
```

Содержание файла:

```pug
extends ../sample/_default

block tools 
	include ../utils/_mixins

block title
	title Контакты

block main
  	[...code]
```

Gulp скомпилирует это в `contacts.html`.

---

## 💡 Рекомендации по стилям

- Все SCSS-компоненты разделены по папкам (`base/`, `components/`, `layout/`, `utils/`)
- Используйте `_vars.scss`, `_media.scss` и `_mixins.scss` для гибкости
- Подключайте сторонние библиотеки через `libs/` или `npm`

---

## 🧑‍💻 Автор

Разработка и поддержка:  
**Mishka-Web** — [github.com/Mishka-Web](https://github.com/Mishka-Web)

---

## 📄 Лицензия

MIT — свободное использование и распространение.
