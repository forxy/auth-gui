### Create oauth.key, use a password phrase when asked
### When asked 'Common Name (e.g. server FQDN or YOUR name) []:' use your hostname, i.e 'mysite.dev'
openssl genrsa -des3 -out oauth.key 1024
openssl req -new -key oauth.key -out oauth.csr
openssl x509 -req -days 3650 -in oauth.csr -out oauth.crt -signkey oauth.key

### Create server certificate
#openssl genrsa -des3 -out server.key 1024
#openssl req -new -key server.key -out server.csr

### Remove password from the certificate
#cp server.key server.key.org
#openssl rsa -in server.key.org -out server.key

### Generate self-siged certificate
#openssl x509 -req -days 3650 -in server.csr -signkey server.key -out server.crt
