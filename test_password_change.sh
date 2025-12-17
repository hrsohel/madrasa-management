#!/bin/bash

EMAIL="hrsohel679@gmail.com"
OLD_PASSWORD="123456"
NEW_PASSWORD="newpassword123"

echo "1. Initial Login..."
LOGIN_RES=$(curl -s -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$OLD_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RES | jq -r '.data.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Initial login failed. User might already have new password? Trying new password..."
  # Try checking if password was already changed
  LOGIN_RES=$(curl -s -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$NEW_PASSWORD\"}")
  TOKEN=$(echo $LOGIN_RES | jq -r '.data.token')
  if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
      echo "Already on new password. Resetting to old password for test..."
      TEMP_OLD=$NEW_PASSWORD
      TEMP_NEW=$OLD_PASSWORD
  else
      echo "Cannot login with old or new password. Exiting."
      exit 1
  fi
else
    TEMP_OLD=$OLD_PASSWORD
    TEMP_NEW=$NEW_PASSWORD
    echo "Initial login successful."
fi

# Change Password
echo "2. Changing Password from $TEMP_OLD to $TEMP_NEW..."
CHANGE_RES=$(curl -s -X POST http://localhost:5000/api/v1/users/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"oldPassword\": \"$TEMP_OLD\", \"newPassword\": \"$TEMP_NEW\"}")

echo $CHANGE_RES

# Verify New Login
echo "3. Verifying Login with New Password..."
NEW_LOGIN_RES=$(curl -s -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$TEMP_NEW\"}")

NEW_TOKEN=$(echo $NEW_LOGIN_RES | jq -r '.data.token')

if [ "$NEW_TOKEN" != "null" ] && [ ! -z "$NEW_TOKEN" ]; then
  echo "SUCCESS: Login with new password work!"
else
  echo "FAILED: Could not login with new password."
  echo $NEW_LOGIN_RES
fi
