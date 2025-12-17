#!/bin/bash

# Login and get token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hrsohel679@gmail.com",
    "password": "123456"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed"
  echo $LOGIN_RESPONSE
  exit 1
fi

echo "Login successful."

# Fetch Incomes
echo "Fetching Incomes..."
curl -s -X GET http://localhost:5000/api/v1/students/accounts/get-all-incomes \
  -H "Authorization: Bearer $TOKEN" | jq .

# Fetch Expenses
echo "Fetching Expenses..."
curl -s -X GET http://localhost:5000/api/v1/students/accounts/get-all-expenses \
  -H "Authorization: Bearer $TOKEN" | jq .
