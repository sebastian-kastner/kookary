.PHONY: help
# Show this help.
help:
	@awk '/^#/{c=substr($$0,3);next}c&&/^[[:alpha:]][[:alnum:]_-]+:/{print substr($$1,1,index($$1,":")),c}1{c=0}' $(MAKEFILE_LIST) | column -s: -t

.PHONY: server
# run npm development server
server:
	npm run serve

.PHONY: build
# run npm build
build:
	npm run build

.PHONY: api
# run api code generation
api:
	../server/bin/console api:openapi:export > swagger.json
	openapi-generator-cli generate -i swagger.json -g typescript-axios -o rest --additional-properties=withSeparateModelsAndApi=true,modelPackage=models,apiPackage=api
	rm swagger.json
