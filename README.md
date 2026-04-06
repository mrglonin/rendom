# Freedom Generator

Рабочий розыгрыш по Excel-отчётам Ticketon. Приложение принимает `xlsx/xls`, находит строку заголовков, строит пул участников, даёт фильтры по данным файла и выполняет случайный draw с возможностью исключать победителей из следующих раундов.

## Что уже реализовано

- загрузка Excel-файла через UI и через API
- автоматическое определение структуры отчёта
- preview участников с фильтрами и выбором поля отображения
- случайный draw с настройками:
  - количество победителей
  - сортировка результатов
  - автоматическое исключение победителей из пула
- отдельный экран результатов
- disk-backed сессии и debug-логи в `logs/app.log`
- локальный запуск в Docker

## Локальный запуск без Docker

```bash
npm install
npm run build
npm start
```

Открыть: [http://localhost:3000](http://localhost:3000)

## Локальный запуск в Docker

```bash
docker compose up --build -d
```

Открыть: [http://localhost:3000](http://localhost:3000)

Остановить:

```bash
docker compose down
```

## Запуск в Plesk Node.js

Проект уже подготовлен так, чтобы его можно было запустить в Plesk без Docker.

Что указать в Plesk:

- `Application mode`: `Production`
- `Document root`: `dist`
- `Application root`: корень репозитория
- `Application startup file`: `server/index.js`
- `Node.js version`: `20+`

Что сделать после загрузки файлов:

1. Нажать `NPM Install`.
2. Не запускать отдельный build, если вы выкатываете этот репозиторий как есть: папка `dist` уже включена в репозиторий.
3. Убедиться, что у приложения есть права на запись в папки `logs` и `storage`.
4. Запустить или перезапустить приложение из панели Plesk.

Опциональные переменные окружения:

- `PORT` — порт приложения, обычно Plesk подставляет сам
- `MAX_UPLOAD_SIZE_MB` — максимальный размер Excel-файла
- `PREVIEW_LIMIT` — размер первой порции preview в списке
- `LOG_LEVEL` — уровень логирования, по умолчанию `debug`

## Полезные пути

- `logs/app.log` — серверные debug-логи
- `storage/uploads` — загруженные файлы
- `storage/sessions` — сохранённые сессии розыгрыша
- `src/pages/random` — экран загрузки и настроек
- `src/pages/results` — экран результатов
- `server` — backend/API, парсинг Excel и логика draw
