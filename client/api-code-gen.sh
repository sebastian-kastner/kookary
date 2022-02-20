
#!/bin/sh

curl -O http://localhost:8000/api/docs.json
openapi-generator-cli generate -i docs.json -g typescript-axios -o src/api
rm docs.json