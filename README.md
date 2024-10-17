# Exam App Api

## Run docker

### Build docker

```sh
docker-compose build
```

### Start

```sh
docker-compose up -d
```

### Config db

```sh
docker exec -it backend bash
```

```sh
composer install
```

```sh
php artisan migrate
```

```sh
php artisan db:seed --class=UserSeeder
```

### Fix jwt error

```sh
php jwt:secret
```

### Login Account

namadmin@gmail.com \
password
