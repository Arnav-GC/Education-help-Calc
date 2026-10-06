"""
Marks Calculator Core Domain Logic
Provides OOP models and calculation logic for student subject marks,
percentages, grade determination, and statistical summaries.
"""

from dataclasses import dataclass, field, asdict
from typing import List, Optional, Dict, Any


@dataclass
class Subject:
    name: str
    obtained_marks: float
    max_marks: float
    percentage: float = 0.0
    passed: bool = False
    grade: str = "F"

    def __post_init__(self):
        if self.max_marks <= 0:
            raise ValueError(f"Max marks for '{self.name}' must be greater than 0.")
        if self.obtained_marks < 0:
            raise ValueError(f"Obtained marks for '{self.name}' cannot be negative.")
        if self.obtained_marks > self.max_marks:
            raise ValueError(
                f"Obtained marks ({self.obtained_marks}) cannot exceed max marks ({self.max_marks}) for '{self.name}'."
            )
        
        self.percentage = round((self.obtained_marks * 100.0) / self.max_marks, 2)
        self.passed = self.percentage >= 35.0  # Base logic from original script
        self.grade = self._calculate_grade(self.percentage)

    @staticmethod
    def _calculate_grade(pct: float) -> str:
        if pct >= 90:
            return "A+"
        elif pct >= 80:
            return "A"
        elif pct >= 70:
            return "B"
        elif pct >= 60:
            return "C"
        elif pct >= 50:
            return "D"
        elif pct >= 35:
            return "E"
        else:
            return "F"


@dataclass
class StudentReport:
    student_name: str
    subjects: List[Subject] = field(default_factory=list)
    passing_threshold: float = 35.0
    total_obtained: float = 0.0
    total_max: float = 0.0
    overall_percentage: float = 0.0
    passed_overall: bool = False
    passed_all_subjects: bool = False
    overall_grade: str = "F"
    highest_subject: Optional[Dict[str, Any]] = None
    lowest_subject: Optional[Dict[str, Any]] = None

    def calculate(self) -> "StudentReport":
        if not self.subjects:
            raise ValueError("At least one subject is required to calculate marks.")

        # Re-evaluate subject pass status with custom threshold if provided
        for sub in self.subjects:
            sub.passed = sub.percentage >= self.passing_threshold

        self.total_obtained = round(sum(s.obtained_marks for s in self.subjects), 2)
        self.total_max = round(sum(s.max_marks for s in self.subjects), 2)

        if self.total_max > 0:
            self.overall_percentage = round((self.total_obtained * 100.0) / self.total_max, 2)
        else:
            self.overall_percentage = 0.0

        # Original logic: passed in average if overall_percentage >= 35
        self.passed_overall = self.overall_percentage >= self.passing_threshold
        self.passed_all_subjects = all(s.passed for s in self.subjects)
        self.overall_grade = Subject._calculate_grade(self.overall_percentage)

        # Min and Max subjects based on percentage
        sorted_by_pct = sorted(self.subjects, key=lambda s: s.percentage)
        lowest = sorted_by_pct[0]
        highest = sorted_by_pct[-1]

        self.lowest_subject = {
            "name": lowest.name,
            "obtained": lowest.obtained_marks,
            "max": lowest.max_marks,
            "percentage": lowest.percentage,
        }
        self.highest_subject = {
            "name": highest.name,
            "obtained": highest.obtained_marks,
            "max": highest.max_marks,
            "percentage": highest.percentage,
        }

        return self

    def to_dict(self) -> Dict[str, Any]:
        return {
            "student_name": self.student_name,
            "total_obtained": self.total_obtained,
            "total_max": self.total_max,
            "overall_percentage": self.overall_percentage,
            "passed_overall": self.passed_overall,
            "passed_all_subjects": self.passed_all_subjects,
            "overall_grade": self.overall_grade,
            "passing_threshold": self.passing_threshold,
            "highest_subject": self.highest_subject,
            "lowest_subject": self.lowest_subject,
            "subjects": [asdict(s) for s in self.subjects],
        }


class MarksCalculator:
    """High-level service class to run marks calculations."""

    @staticmethod
    def compute_report(
        student_name: str,
        subjects_data: List[Dict[str, Any]],
        passing_threshold: float = 35.0,
    ) -> StudentReport:
        if not student_name or not student_name.strip():
            student_name = "Student"

        subjects = []
        for item in subjects_data:
            name = str(item.get("name", "")).strip()
            if not name:
                continue

            try:
                obtained = float(item.get("obtained", 0))
                max_marks = float(item.get("max", 100))
            except (ValueError, TypeError):
                raise ValueError(f"Invalid numeric marks provided for subject '{name}'.")

            subject = Subject(
                name=name,
                obtained_marks=obtained,
                max_marks=max_marks,
            )
            subjects.append(subject)

        report = StudentReport(
            student_name=student_name.strip(),
            subjects=subjects,
            passing_threshold=float(passing_threshold),
        )
        return report.calculate()
