# Установка GitHub Actions Self-hosted Runner с PM2

## Шаг 1: Установка runner на сервере

```bash
# Перейти в домашнюю директорию
cd ~

# Создать папку для runner
mkdir -p actions-runner && cd actions-runner

# Скачать последнюю версию runner (Linux x64)
# Проверьте актуальную версию: https://github.com/actions/runner/releases
curl -o actions-runner-linux-x64-2.330.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.330.0.tar.gz

# Распаковать
tar xzf ./actions-runner-linux-x64-2.330.0.tar.gz

# Сделать скрипты исполняемыми
chmod +x bin/installdependencies.sh
./bin/installdependencies.sh
```

## Шаг 2: Получить токен из GitHub

1. Перейдите в ваш репозиторий: `https://github.com/max-matveevv/practic-crm`
2. Settings → Actions → Runners → New self-hosted runner
3. Выберите **Linux** и скопируйте команду конфигурации (она будет выглядеть так):
   ```bash
   ./config.sh --url https://github.com/max-matveevv/practic-crm --token AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

## Шаг 3: Настроить runner

```bash
# Выполнить команду конфигурации (с вашим токеном)
./config.sh --url https://github.com/max-matveevv/practic-crm --token YOUR_TOKEN

# При настройке выберите:
# - Runner name: practic-crm-runner (или любое другое)
# - Work folder: _work (по умолчанию)
# - Labels: оставьте пустым или добавьте "self-hosted"
```

## Шаг 4: Добавить runner в PM2

```bash
# Обновить ecosystem.config.js на сервере
# Скопировать файл deploy/ecosystem.config.js в корень проекта

# Или добавить вручную в PM2:
cd /home/practic-crm/htdocs/crm.practic.studio
pm2 start deploy/ecosystem.config.js

# Или добавить только runner:
pm2 start run.sh --name github-actions-runner --cwd /home/practic-crm/actions-runner
```

## Шаг 5: Сохранить конфигурацию PM2

```bash
# Сохранить текущую конфигурацию PM2
pm2 save

# Настроить автозапуск при перезагрузке сервера
pm2 startup
# Выполните команду, которую покажет PM2
```

## Проверка работы

```bash
# Проверить статус runner в PM2
pm2 status

# Проверить логи
pm2 logs github-actions-runner

# В GitHub проверить статус runner:
# Settings → Actions → Runners
# Должен быть зеленый индикатор "Idle" или "Active"
```

## Обновление runner

```bash
# Остановить runner
pm2 stop github-actions-runner

# Обновить runner
cd ~/actions-runner
./run.sh --update

# Запустить снова
pm2 restart github-actions-runner
```

## Удаление runner

```bash
# Остановить и удалить из PM2
pm2 delete github-actions-runner

# Удалить конфигурацию из GitHub
cd ~/actions-runner
./config.sh remove --token YOUR_TOKEN

# Удалить папку
cd ~
rm -rf actions-runner
```

## Важные замечания

1. **Runner работает от имени пользователя**, который его запустил
2. Убедитесь, что у пользователя есть права на:
   - `/home/practic-crm/htdocs/crm.practic.studio` (git pull)
   - `composer`, `npm`, `php artisan` команды
   - `pm2` команды
3. **Секреты GitHub** автоматически доступны в workflow через `${{ secrets.XXX }}`
4. Runner будет автоматически перезапускаться через PM2 при сбоях

