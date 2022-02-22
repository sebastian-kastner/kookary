
#!/bin/sh

../server/bin/console api:openapi:export > swagger.json
openapi-generator-cli generate -i swagger.json -g typescript-axios -o src/api 
rm swagger.json
