.PHONY: help
# Show this help.
help:
	@awk '/^#/{c=substr($$0,3);next}c&&/^[[:alpha:]][[:alnum:]_-]+:/{print substr($$1,1,index($$1,":")),c}1{c=0}' $(MAKEFILE_LIST) | column -s: -t

.PHONY: server
# start development server
server:
	php bin/console cache:clear
	symfony server:start

.PHONY: build
# build for production
build:
	composer dump-autoload --optimize --no-dev --classmap-authoritative
	APP_ENV=prod APP_DEBUG=0 php bin/console cache:clear

.PHONY: certs
# create certificates
certs:
	php bin/console lexik:jwt:generate-keypair

# for more details about migrations, see: https://symfony.com/bundles/DoctrineMigrationsBundle/current/index.html
.PHONY: migration-create
# Generate a migration by comparing your current database to your mapping information.
migration-create:
	php bin/console doctrine:migrations:diff

.PHONY: migration-execute
# Execute a migration to the latest available version.
migration-execute:
	php bin/console doctrine:migrations:migrate

.PHONY: migration-update-schema
# Update schema of database table according to existing entities (e.g. create new tables)
migration-update-schema:
	php bin/console doctrine:schema:update --dump-sql

.PHONY: dump-db
# Dumps the database to sql file (as root user, with password prompt)
dump-db:
	mysqldump -u root -p --databases kookary > dump_kookary_$$(date +"%m_%d_%Y").sql

.PHONY: getters-setters
# Regenerates getters and setters for the entire App (where required)
getters-setters:
	php bin/console make:entity --regenerate App
