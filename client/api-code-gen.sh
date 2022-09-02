
#!/bin/sh
../../db_rework/bin/console api:openapi:export > swagger.json
openapi-generator-cli generate -i swagger.json -g typescript-axios -o rest --additional-properties=withSeparateModelsAndApi=true,modelPackage=models,apiPackage=api
rm swagger.json
