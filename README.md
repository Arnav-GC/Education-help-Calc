<div align="center">

# 📊 EduCalc Pro: Student Marks & Grade Calculator

An enterprise-grade, multi-language Student Grade & Marks Calculator built with **Python**, **Java**, **JavaScript**, **HTML5**, **CSS3**, and **Go**.

[![Python 3.8+](https://img.shields.io/badge/Python-3.8+-blue.svg?logo=python&logoColor=white)](#)
[![Java 8+](https://img.shields.io/badge/Java-8+-orange.svg?logo=openjdk&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg?logo=javascript&logoColor=white)](#)
[![HTML5](https://img.shields.io/badge/HTML5-Modern-E34F26.svg?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-Responsive-1572B6.svg?logo=css3&logoColor=white)](#)
[![Go](https://img.shields.io/badge/Go-1.20+-00ADD8.svg?logo=go&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<br/>

### 🌐 [Click Here to Open Live Calculator in Browser](https://arnav-gc.github.io/Education-help-Calc/)

</div>

---

## 🌟 Overview

**EduCalc Pro** is a modern evolution of the foundational `semiproject1markscalc2.py` script. It transforms a basic sequential console script into a production-ready, full-stack application featuring:
- A responsive, glassmorphic **Web Application** (HTML5, CSS3, JavaScript).
- A zero-dependency **Python REST API & Service Layer**.
- A standalone **Java SE OOP & CLI / Server Engine**.
- High-concurrency **Node.js** and **Go** microservices.
- Print-ready **Report Card generation (PDF)** and **CSV/JSON exports**.

---

## 🚀 Key Features

- **Dynamic Subject Management**: Add, modify, and delete any number of subjects with real-time percentage previews (no hardcoded limits).
- **Flexible Scoring Modes**:
  - *Uniform Mode*: All subjects share the same maximum mark (e.g., 100).
  - *Variable Mode*: Each subject has customized maximum marks (e.g., Internal 20, Theory 80).
- **Comprehensive Grade Logic**:
  - Calculates Total Obtained, Maximum Marks, and Aggregate Percentage.
  - Grade Bands: `A+` (≥90%), `A` (≥80%), `B` (≥70%), `C` (≥60%), `D` (≥50%), `E` (≥35%), `F` (<35%).
  - Identifies Highest and Lowest scoring subjects.
  - Flags per-subject pass/fail status and aggregate pass/fail status.
- **Export & Reporting**:
  - 🖨️ Clean printable report cards (formatted via CSS `@media print` for saving directly as PDF).
  - 📥 Export to `.csv` spreadsheet.
  - 💾 Export to `.json` file.
  - 🕒 Automatic local calculation history stored in browser `localStorage`.
- **Zero-Dependency Architecture**: Python and Java backends run directly with standard libraries—no external pip packages or build tools strictly required!

---

## 📁 Project Structure

```text
Marks Calculator/
├── app.py                         # Unified Python Web Server & REST API (0 external deps)
├── run.bat                        # Windows 1-click launcher
├── requirements.txt               # Optional Python package definitions
├── LICENSE                        # MIT License
├── README.md                      # Complete project documentation
├── semiproject1markscalc2.py      # Original baseline script (preserved)
│
├── src/
│   ├── web/                       # Frontend Web UI
│   │   ├── index.html             # Semantic, accessible HTML5 structure
│   │   ├── styles.css             # Modern CSS3 design, glassmorphism & print stylesheet
│   │   └── app.js                 # Reactive JS controller, client calculation & API sync
│   │
│   ├── python/                    # Python Backend Module
│   │   ├── __init__.py
│   │   ├── marks_calculator.py    # Clean OOP calculation models (Subject, StudentReport)
│   │   └── cli.py                 # Upgraded interactive Python terminal CLI
│   │
│   └── java/                      # Java Backend & CLI Engine
│       └── MarksCalculator.java   # Java SE OOP engine, CLI and embedded HTTP server
│
├── backends/                      # Additional Backend Implementations
│   ├── node/
│   │   ├── server.js              # Node.js REST API microservice
│   │   └── package.json
│   └── go/
│       ├── main.go                # Go high-concurrency REST API
│       └── go.mod
│
└── tests/
    └── test_calculator.py         # Python unit test suite (100% passing)
```

---

## ⚡ Quick Start Guides

### Option 1: Run the Full-Stack Web Application (Python)
Double-click `run.bat` or run in terminal:
```bash
python app.py
```
Open your browser at **[http://localhost:5000](http://localhost:5000)**.

### Option 2: Run the Enhanced Python CLI
```bash
python src/python/cli.py
```

### Option 3: Run the Python Unit Tests
```bash
python -m unittest tests/test_calculator.py
```

---

### Option 4: Run the Java Implementation
Compile and run the Java CLI:
```bash
javac src/java/MarksCalculator.java
java -cp src/java com.educalc.MarksCalculator
```
To run the embedded Java HTTP Server on port 8080:
```bash
java -cp src/java com.educalc.MarksCalculator --server 8080
```

---

### Option 5: Run the Node.js Microservice
```bash
cd backends/node
node server.js
```
Listens on `http://localhost:4000`.

---

### Option 6: Run the Go Microservice
```bash
cd backends/go
go run main.go
```
Listens on `http://localhost:8090`.

---

## 📡 REST API Documentation

### Calculate Marks
- **Endpoint**: `POST /api/calculate`
- **Content-Type**: `application/json`

#### Request Payload
```json
{
  "student_name": "Arnav",
  "passing_threshold": 35.0,
  "subjects": [
    { "name": "Mathematics", "obtained": 85, "max": 100 },
    { "name": "Physics", "obtained": 92, "max": 100 },
    { "name": "English", "obtained": 74, "max": 100 }
  ]
}
```

#### Response Payload (200 OK)
```json
{
  "student_name": "Arnav",
  "total_obtained": 251.0,
  "total_max": 300.0,
  "overall_percentage": 83.67,
  "passed_overall": true,
  "passed_all_subjects": true,
  "overall_grade": "A",
  "passing_threshold": 35.0,
  "highest_subject": {
    "name": "Physics",
    "percentage": 92.0,
    "obtained": 92.0,
    "max": 100.0
  },
  "lowest_subject": {
    "name": "English",
    "percentage": 74.0,
    "obtained": 74.0,
    "max": 100.0
  },
  "subjects": [
    {
      "name": "Mathematics",
      "obtained_marks": 85.0,
      "max_marks": 100.0,
      "percentage": 85.0,
      "passed": true,
      "grade": "A"
    }
  ]
}
```

---

## 📤 How to Upload to GitHub

Follow these steps to upload this project directly to your GitHub profile:

1. **Create a New Repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Enter repository name: `marks-calculator-pro` (or any name you like).
   - Keep it **Public** (or Private).
   - **Do NOT** check "Initialize with README" (we already created a complete README for you).
   - Click **Create repository**.

2. **Initialize Git inside this project folder**:
   Open PowerShell or Terminal in this folder (`Marks Calculator`) and run:
   ```powershell
   # 1. Initialize local git repository
   git init

   # 2. Add all project files
   git add .

   # 3. Create initial commit
   git commit -m "feat: complete multi-language Marks Calculator application"

   # 4. Set main branch
   git branch -M main

   # 5. Link to your remote GitHub repository (replace with your repo URL)
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

   # 6. Push to GitHub
   git push -u origin main
   ```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
