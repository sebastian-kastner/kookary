# Snippets

## Client


## Server

- dump database: ``mysqldump -u root -p --databases chef > chef.sql``
- reverse engineer/create entities from database:
  - ``php bin/console doctrine:mapping:import "App\Entity" annotation --path=src/Entity``
  - ``php bin/console make:entity --regenerate App``
  (see [reverse engineering docs](https://symfony.com/doc/current/doctrine/reverse_engineering.html))

### Symfony and Doctrine

- create symfony project: ``symfony new my_rest_api``
- add ApiPlatform: ``composer require api``
- create database settings: ``cp .env .env.local`` 
  - edit .env.local
- create entities from database: ``php bin/console doctrine:mapping:import "App\Entity" annotation --path=src/Entity``
- install maker bundle: ``composer require symfony/maker-bundle --dev``
- create getter/setter methods for everything: ``php bin/console make:entity --regenerate App``
  - or for specific entity: ``php bin/console make:entity --regenerate App\Entity\Country``


see: 

- [Symfony and API Platform project setup](https://digitalfortress.tech/tutorial/rest-api-with-symfony-and-api-platform/)
- [Create doctrine entities from database](https://symfony.com/doc/current/doctrine/reverse_engineering.html)
