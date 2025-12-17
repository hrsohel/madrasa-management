# Add Student via cURL Commands

## Step 1: Login to Get Token

```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

**Response Example:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Copy the `token` value from the response.

---

## Step 2: Add Student (Replace YOUR_TOKEN_HERE)

```bash
curl -X POST http://localhost:5000/api/v1/students/students/add-student \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "student": {
      "name": "আবদুল করিম",
      "dob": "2010-05-15",
      "nid": "12345678901",
      "birthCertificate": "20105678901234567",
      "gender": "Male",
      "bloodGroup": "A+",
      "phone": "01712345678",
      "uid": "STD-2025-00001",
      "residential": "Hostel",
      "roll": "101",
      "class": "Class 5",
      "shift": "Morning",
      "section": "A",
      "division": "Dhaka",
      "session": "25-26"
    },
    "guardian": {
      "fatherName": "মোহাম্মদ রহিম",
      "fatherNID": "1234567890",
      "fatherPhone": "01712345679",
      "motherName": "ফাতেমা বেগম",
      "motherNID": "9876543210",
      "motherPhone": "01812345678",
      "guardianName": "মোহাম্মদ রহিম",
      "guardianNID": "1234567890",
      "guardianPhone": "01712345679",
      "guardianRelation": "Father"
    },
    "address": {
      "presentDivision": "Dhaka",
      "presentDistrict": "Dhaka",
      "presentUpazila": "Mirpur",
      "presentUnion": "Mirpur-1",
      "presentVillage": "Block A",
      "presentOthers": "Road 5, House 10",
      "permanentDivision": "Dhaka",
      "permanentDistrict": "Dhaka",
      "permanentUpazila": "Mirpur",
      "permanentUnion": "Mirpur-1",
      "permanentVillage": "Block A",
      "permanentOthers": "Road 5, House 10",
      "isSameAsPresent": true
    },
    "madrasa": {
      "oldMadrasaName": "ABC Madrasa",
      "oldMadrasaClass": "Class 4",
      "oldMadrasaResult": "Passed",
      "oldMadrasaDivision": "নাজেরা",
      "talimiGuardianName": "মাওলানা আহমেদ",
      "talimiGuardianPhone": "01912345678",
      "admissionExaminer": "মাওলানা সাদিক",
      "admissionResult": "Selected"
    },
    "fees": {
      "admissionFee": 5000,
      "libraryFee": 500,
      "confirmFee": 1000,
      "ITFee": 300,
      "IDCardFee": 200,
      "kafelaFee": 2000,
      "booksFee": 1500,
      "helpType": "None",
      "helpAmount": 0
    }
  }'
```

---

## Step 3: Add Student with Profile Image

```bash
curl -X POST http://localhost:5000/api/v1/students/students/add-student \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F 'student={"name":"আবদুল করিম","dob":"2010-05-15","nid":"12345678901","birthCertificate":"20105678901234567","gender":"Male","bloodGroup":"A+","phone":"01712345678","uid":"STD-2025-00002","residential":"Hostel","roll":"102","class":"Class 5","shift":"Morning","section":"A","division":"Dhaka","session":"25-26"}' \
  -F 'guardian={"fatherName":"মোহাম্মদ রহিম","fatherNID":"1234567890","fatherPhone":"01712345679","motherName":"ফাতেমা বেগম","motherNID":"9876543210","motherPhone":"01812345678","guardianName":"মোহাম্মদ রহিম","guardianNID":"1234567890","guardianPhone":"01712345679","guardianRelation":"Father"}' \
  -F 'address={"presentDivision":"Dhaka","presentDistrict":"Dhaka","presentUpazila":"Mirpur","presentUnion":"Mirpur-1","presentVillage":"Block A","presentOthers":"Road 5, House 10","permanentDivision":"Dhaka","permanentDistrict":"Dhaka","permanentUpazila":"Mirpur","permanentUnion":"Mirpur-1","permanentVillage":"Block A","permanentOthers":"Road 5, House 10","isSameAsPresent":true}' \
  -F 'madrasa={"oldMadrasaName":"ABC Madrasa","oldMadrasaClass":"Class 4","oldMadrasaResult":"Passed","oldMadrasaDivision":"নাজেরা","talimiGuardianName":"মাওলানা আহমেদ","talimiGuardianPhone":"01912345678","admissionExaminer":"মাওলানা সাদিক","admissionResult":"Selected"}' \
  -F 'fees={"admissionFee":5000,"libraryFee":500,"confirmFee":1000,"ITFee":300,"IDCardFee":200,"kafelaFee":2000,"booksFee":1500,"helpType":"None","helpAmount":0}' \
  -F 'profileImage=@/path/to/student/photo.jpg'
```

---

## Quick Test (All-in-One Script)

Run the automated script:

```bash
bash /tmp/add_student_example.sh
```

**Note:** Make sure to update the email/password in the script with your actual credentials.

---

## Expected Success Response

```json
{
  "status": 201,
  "success": true,
  "messages": "student added",
  "data": []
}
```
