package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"sort"
	"strings"
)

type SubjectInput struct {
	Name     string  `json:"name"`
	Obtained float64 `json:"obtained"`
	Max      float64 `json:"max"`
}

type SubjectResult struct {
	Name          string  `json:"name"`
	ObtainedMarks float64 `json:"obtained_marks"`
	MaxMarks      float64 `json:"max_marks"`
	Percentage    float64 `json:"percentage"`
	Passed        bool    `json:"passed"`
	Grade         string  `json:"grade"`
}

type CalculateRequest struct {
	StudentName      string         `json:"student_name"`
	PassingThreshold float64        `json:"passing_threshold"`
	Subjects         []SubjectInput `json:"subjects"`
}

type CalculateResponse struct {
	StudentName       string          `json:"student_name"`
	TotalObtained     float64         `json:"total_obtained"`
	TotalMax          float64         `json:"total_max"`
	OverallPercentage float64         `json:"overall_percentage"`
	PassedOverall     bool            `json:"passed_overall"`
	PassedAllSubjects bool            `json:"passed_all_subjects"`
	OverallGrade      string          `json:"overall_grade"`
	PassingThreshold  float64         `json:"passing_threshold"`
	HighestSubject    *SubjectResult  `json:"highest_subject,omitempty"`
	LowestSubject     *SubjectResult  `json:"lowest_subject,omitempty"`
	Subjects          []SubjectResult `json:"subjects"`
}

func calculateGrade(pct float64) string {
	switch {
	case pct >= 90:
		return "A+"
	case pct >= 80:
		return "A"
	case pct >= 70:
		return "B"
	case pct >= 60:
		return "C"
	case pct >= 50:
		return "D"
	case pct >= 35:
		return "E"
	default:
		return "F"
	}
}

func round(val float64) float64 {
	return math.Round(val*100) / 100
}

func enableCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func handleCalculate(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var req CalculateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	threshold := req.PassingThreshold
	if threshold <= 0 {
		threshold = 35.0
	}

	studentName := strings.TrimSpace(req.StudentName)
	if studentName == "" {
		studentName = "Student"
	}

	if len(req.Subjects) == 0 {
		http.Error(w, `{"error":"At least one subject is required"}`, http.StatusBadRequest)
		return
	}

	var totalObtained, totalMax float64
	var results []SubjectResult
	allPassed := true

	for _, sub := range req.Subjects {
		if sub.Max <= 0 {
			http.Error(w, fmt.Sprintf(`{"error":"Max marks for %s must be > 0"}`, sub.Name), http.StatusBadRequest)
			return
		}
		if sub.Obtained < 0 || sub.Obtained > sub.Max {
			http.Error(w, fmt.Sprintf(`{"error":"Obtained marks invalid for %s"}`, sub.Name), http.StatusBadRequest)
			return
		}

		pct := round((sub.Obtained * 100.0) / sub.Max)
		passed := pct >= threshold
		if !passed {
			allPassed = false
		}

		res := SubjectResult{
			Name:          sub.Name,
			ObtainedMarks: sub.Obtained,
			MaxMarks:      sub.Max,
			Percentage:    pct,
			Passed:        passed,
			Grade:         calculateGrade(pct),
		}
		results = append(results, res)
		totalObtained += sub.Obtained
		totalMax += sub.Max
	}

	overallPct := round((totalObtained * 100.0) / totalMax)
	passedOverall := overallPct >= threshold

	// Sort to find min/max
	sorted := make([]SubjectResult, len(results))
	copy(sorted, results)
	sort.Slice(sorted, func(i, j int) bool {
		return sorted[i].Percentage < sorted[j].Percentage
	})

	resp := CalculateResponse{
		StudentName:       studentName,
		TotalObtained:     round(totalObtained),
		TotalMax:          round(totalMax),
		OverallPercentage: overallPct,
		PassedOverall:     passedOverall,
		PassedAllSubjects: allPassed,
		OverallGrade:      calculateGrade(overallPct),
		PassingThreshold:  threshold,
		HighestSubject:    &sorted[len(sorted)-1],
		LowestSubject:     &sorted[0],
		Subjects:          results,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func main() {
	port := 8090
	http.HandleFunc("/api/calculate", handleCalculate)
	http.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(&w)
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"healthy","engine":"Go High-Performance Server","version":"2.0.0"}`))
	})

	fmt.Printf("[Go Engine] Server running on http://localhost:%d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
