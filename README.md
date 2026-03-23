# Modern Gulp Starter

Современная сборка для вёрстки на `Gulp` с понятной структурой:

- `src/pages` для страниц
- `src/templates` для layout-шаблонов
- `src/blocks` для переиспользуемых блоков-компонентов
- `src/scss` для глобальных стилей и точек входа
- `src/js` для точек входа JS
- `dist` для готовой сборки

## Команды

```bash
npm install
npm run dev
npm run build
```

`npm run dev` поднимает локальный сервер, следит за файлами и собирает sourcemaps.  
`npm run build` делает production-сборку в `dist`.

## Структура

```text
src/
  data/
    site.json
  js/
    main.js
  pages/
    index.njk
    smt.njk
  templates/
    layouts/
      base.njk
  blocks/
    header/
      _header.scss
      header.js
      header.njk
    hero/
      _hero.scss
      hero.njk
    footer/
      _footer.scss
      footer.njk
  scss/
    base/
      _base.scss
      _reset.scss
      _vars.scss
    style.scss
```

## Как создавать страницу

Создай файл в `src/pages`, например `about.njk`:

```njk
{% extends "layouts/base.njk" %}
{% set page = {
  title: "About",
  description: "Описание страницы"
} %}

{% from "blocks/hero/hero.njk" import hero %}

{% block content %}
  {{ hero({
    eyebrow: "Новая страница",
    title: "Страница собрана из блоков",
    text: "Компоненты можно переиспользовать между страницами."
  }) }}
{% endblock %}
```

## Как создавать блок

1. Создай папку `src/blocks/my-block/`
2. Добавь шаблон `my-block.njk`
3. Добавь стили `_my-block.scss`
4. Если нужен JS, добавь `my-block.js`
5. Подключи стили в `src/scss/style.scss`
6. Подключи JS-модуль в `src/js/main.js`

Пример шаблона блока:

```njk
{% macro myBlock(props = {}) %}
<section class="my-block">
  <div class="container">
    <h2>{{ props.title or "Заголовок блока" }}</h2>
  </div>
</section>
{% endmacro %}
```

## Best practices для вёрстки

- Держи `dist` только как результат сборки, не редактируй его вручную.
- Страницы собирай из блоков, а не копируй одинаковую разметку.
- Используй макросы `Nunjucks`, когда блоку нужны параметры.
- JS пиши модулями, а не одной большой простынёй.
- Базовые переменные, reset и общие утилиты держи отдельно от блоков.
- Сторонние библиотеки ставь через `npm`, а не складывай вручную в проект.
