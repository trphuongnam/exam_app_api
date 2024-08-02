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
php artisan migrate
```
```sh
php artisan db:seed --class=UserSeeder
```

### Login Account
namadmin@gmail.com \
password
