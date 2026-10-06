import unittest
import sys
import os

# Add src/python to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "python")))

from marks_calculator import MarksCalculator, Subject, StudentReport


class TestMarksCalculator(unittest.TestCase):
    def test_basic_calculation_uniform_totals(self):
        subjects = [
            {"name": "Maths", "obtained": 80, "max": 100},
            {"name": "Science", "obtained": 90, "max": 100},
            {"name": "English", "obtained": 70, "max": 100},
        ]
        report = MarksCalculator.compute_report("Arnav", subjects)

        self.assertEqual(report.student_name, "Arnav")
        self.assertEqual(report.total_obtained, 240.0)
        self.assertEqual(report.total_max, 300.0)
        self.assertEqual(report.overall_percentage, 80.0)
        self.assertTrue(report.passed_overall)
        self.assertTrue(report.passed_all_subjects)
        self.assertEqual(report.overall_grade, "A")
        self.assertEqual(report.highest_subject["name"], "Science")
        self.assertEqual(report.lowest_subject["name"], "English")

    def test_variable_totals(self):
        subjects = [
            {"name": "Internal Assessment", "obtained": 18, "max": 20},
            {"name": "Theory Exam", "obtained": 64, "max": 80},
        ]
        report = MarksCalculator.compute_report("Arnav", subjects)

        self.assertEqual(report.total_obtained, 82.0)
        self.assertEqual(report.total_max, 100.0)
        self.assertEqual(report.overall_percentage, 82.0)
        self.assertTrue(report.passed_overall)

    def test_failing_subject(self):
        subjects = [
            {"name": "Physics", "obtained": 20, "max": 100}, # 20% < 35% -> fail
            {"name": "Chemistry", "obtained": 80, "max": 100},
        ]
        report = MarksCalculator.compute_report("Test Student", subjects)

        self.assertEqual(report.total_obtained, 100.0)
        self.assertEqual(report.total_max, 200.0)
        self.assertEqual(report.overall_percentage, 50.0)
        self.assertTrue(report.passed_overall) # 50% >= 35% passed in average
        self.assertFalse(report.passed_all_subjects) # Failed in Physics
        self.assertFalse(report.subjects[0].passed)
        self.assertTrue(report.subjects[1].passed)

    def test_invalid_marks_exceed_max(self):
        with self.assertRaises(ValueError):
            Subject(name="Math", obtained_marks=105, max_marks=100)

    def test_invalid_negative_marks(self):
        with self.assertRaises(ValueError):
            Subject(name="Math", obtained_marks=-5, max_marks=100)

    def test_invalid_max_marks_zero(self):
        with self.assertRaises(ValueError):
            Subject(name="Math", obtained_marks=0, max_marks=0)


if __name__ == "__main__":
    unittest.main()
