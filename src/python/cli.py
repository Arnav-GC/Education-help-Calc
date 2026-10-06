#!/usr/bin/env python3
"""
Enhanced Interactive CLI for Marks Calculator
A production-grade refactor of the original console script, supporting dynamic subjects,
custom pass thresholds, error-recovery, and formatted report cards.
"""

import sys
import os
from typing import List, Dict, Any

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        if hasattr(sys.stderr, "reconfigure"):
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Add src/python to path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from marks_calculator import MarksCalculator


def prompt_positive_float(prompt_text: str) -> float:
    while True:
        try:
            val = float(input(prompt_text).strip())
            if val < 0:
                print("[!] Value cannot be negative. Please enter a valid number.")
                continue
            return val
        except ValueError:
            print("[!] Please enter a valid numeric value.")


def main():
    print("=" * 60)
    print("          STUDENT MARKS & GRADE CALCULATOR (CLI)          ")
    print("=" * 60)

    name = input("Hello, what is your name? ").strip()
    if not name:
        name = "Student"

    print(f"\nWelcome, {name}!")
    print("Tip: Enter subject names and marks. Type 'done' or 'none' when finished.\n")

    same_total_input = input("Are the total marks for each subject the same? (yes/no) [yes]: ").strip().lower()
    is_same_total = same_total_input != "no"

    uniform_max = 100.0
    if is_same_total:
        while True:
            uniform_max = prompt_positive_float("How much is the total marks for each subject? (e.g., 100): ")
            if uniform_max <= 0:
                print("[!] Total marks must be greater than 0.")
                continue
            break

    subjects_data: List[Dict[str, Any]] = []
    subject_index = 1

    while True:
        sub_name = input(f"\nName of Subject {subject_index} (or type 'done' to calculate): ").strip()
        if not sub_name or sub_name.lower() in ("done", "none", "exit", "stop"):
            if not subjects_data:
                print("[!] Please enter at least one subject before finishing.")
                continue
            break

        max_mark = uniform_max
        if not is_same_total:
            while True:
                max_mark = prompt_positive_float(f"What is the total marks for '{sub_name}'?: ")
                if max_mark <= 0:
                    print("[!] Total marks must be greater than 0.")
                    continue
                break

        while True:
            obtained = prompt_positive_float(f"Marks obtained in '{sub_name}'?: ")
            if obtained > max_mark:
                print(f"[!] Error: Obtained marks ({obtained}) cannot exceed total marks ({max_mark}). Try again.")
                continue
            break

        subjects_data.append({
            "name": sub_name,
            "obtained": obtained,
            "max": max_mark
        })
        subject_index += 1

    # Compute calculations
    report = MarksCalculator.compute_report(name, subjects_data, passing_threshold=35.0)

    # Print formatted report
    print("\n" + "=" * 60)
    print(f"                 REPORT CARD: {report.student_name.upper()}")
    print("=" * 60)
    print(f"{'Subject':<22} | {'Obtained':<10} | {'Max':<8} | {'%':<8} | {'Status':<8}")
    print("-" * 60)

    for sub in report.subjects:
        status = "PASSED" if sub.passed else "FAILED"
        print(f"{sub.name:<22} | {sub.obtained_marks:<10.1f} | {sub.max_marks:<8.1f} | {sub.percentage:<7.2f}% | {status:<8}")

    print("-" * 60)
    print(f"Total Obtained Marks : {report.total_obtained} / {report.total_max}")
    print(f"Overall Percentage   : {report.overall_percentage}%")
    print(f"Overall Grade        : {report.overall_grade}")
    print(f"Average Status       : {'PASSED in average' if report.passed_overall else 'FAILED in average'}")
    print(f"All Subjects Status  : {'PASSED in all subjects' if report.passed_all_subjects else 'FAILED in some subjects'}")

    if report.highest_subject:
        print(f"Highest Score        : {report.highest_subject['name']} ({report.highest_subject['percentage']}%)")
    if report.lowest_subject:
        print(f"Lowest Score         : {report.lowest_subject['name']} ({report.lowest_subject['percentage']}%)")

    print("=" * 60)
    print("Thank you!")


if __name__ == "__main__":
    main()
