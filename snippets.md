# Snippets

## Client


## Server

- dump database: ``mysqldump -u root -p --databases chef > chef.sql``
- reverse engineer/create entities from database:
  - ``php bin/console doctrine:mapping:import "App\Entity" annotation --path=src/Entity``
  - ``php bin/console make:entity --regenerate App``
  (see [reverse engineering docs](https://symfony.com/doc/current/doctrine/reverse_engineering.html))
