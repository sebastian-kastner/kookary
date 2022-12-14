.PHONY: help
# Show this help.
help:
	@awk '/^#/{c=substr($$0,3);next}c&&/^[[:alpha:]][[:alnum:]_-]+:/{print substr($$1,1,index($$1,":")),c}1{c=0}' $(MAKEFILE_LIST) | column -s: -t

.PHONY: server
# start development server
server:
	php bin/console cache:clear
	symfony server:start

.PHONY: certs
# create certificates
certs:
	php bin/console lexik:jwt:generate-keypair

# for more details about migrations, see: https://symfony.com/bundles/DoctrineMigrationsBundle/current/index.html
.PHONY: migration-create
migration-create:
# Generate a migration by comparing your current database to your mapping information.
	php bin/console doctrine:migrations:diff

.PHONY: migrate
migrate:
# Execute a migration to the latest available version.
	php bin/console doctrine:migrations:migrate
