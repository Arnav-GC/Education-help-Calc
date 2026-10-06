package com.educalc;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * EduCalc Pro - Java Marks Calculator & Grade Engine
 * Provides Object-Oriented calculation logic, Interactive Console CLI,
 * and a standalone embedded HTTP REST Server with zero external dependencies.
 */
public class MarksCalculator {

    public static class Subject {
        private final String name;
        private final double obtainedMarks;
        private final double maxMarks;
        private final double percentage;
        private final boolean passed;
        private final String grade;

        public Subject(String name, double obtainedMarks, double maxMarks, double passingThreshold) {
            if (maxMarks <= 0) {
                throw new IllegalArgumentException("Max marks for '" + name + "' must be > 0.");
            }
            if (obtainedMarks < 0) {
                throw new IllegalArgumentException("Obtained marks for '" + name + "' cannot be negative.");
            }
            if (obtainedMarks > maxMarks) {
                throw new IllegalArgumentException("Obtained marks (" + obtainedMarks + ") cannot exceed max marks (" + maxMarks + ") for '" + name + "'.");
            }

            this.name = name;
            this.obtainedMarks = obtainedMarks;
            this.maxMarks = maxMarks;
            this.percentage = Math.round(((obtainedMarks * 100.0) / maxMarks) * 100.0) / 100.0;
            this.passed = this.percentage >= passingThreshold;
            this.grade = calculateGrade(this.percentage);
        }

        public static String calculateGrade(double pct) {
            if (pct >= 90) return "A+";
            if (pct >= 80) return "A";
            if (pct >= 70) return "B";
            if (pct >= 60) return "C";
            if (pct >= 50) return "D";
            if (pct >= 35) return "E";
            return "F";
        }

        public String getName() { return name; }
        public double getObtainedMarks() { return obtainedMarks; }
        public double getMaxMarks() { return maxMarks; }
        public double getPercentage() { return percentage; }
        public boolean isPassed() { return passed; }
        public String getGrade() { return grade; }
    }

    public static class StudentReport {
        private final String studentName;
        private final List<Subject> subjects;
        private final double passingThreshold;
        private double totalObtained;
        private double totalMax;
        private double overallPercentage;
        private boolean passedOverall;
        private boolean passedAllSubjects;
        private String overallGrade;
        private Subject highestSubject;
        private Subject lowestSubject;

        public StudentReport(String studentName, List<Subject> subjects, double passingThreshold) {
            if (subjects == null || subjects.isEmpty()) {
                throw new IllegalArgumentException("At least one subject is required.");
            }
            this.studentName = (studentName == null || studentName.trim().isEmpty()) ? "Student" : studentName.trim();
            this.subjects = new ArrayList<>(subjects);
            this.passingThreshold = passingThreshold;
            compute();
        }

        private void compute() {
            this.totalObtained = 0;
            this.totalMax = 0;
            Subject minSub = null;
            Subject maxSub = null;
            boolean allPassed = true;

            for (Subject s : subjects) {
                this.totalObtained += s.getObtainedMarks();
                this.totalMax += s.getMaxMarks();
                if (!s.isPassed()) {
                    allPassed = false;
                }
                if (minSub == null || s.getPercentage() < minSub.getPercentage()) {
                    minSub = s;
                }
                if (maxSub == null || s.getPercentage() > maxSub.getPercentage()) {
                    maxSub = s;
                }
            }

            this.totalObtained = Math.round(this.totalObtained * 100.0) / 100.0;
            this.totalMax = Math.round(this.totalMax * 100.0) / 100.0;
            this.overallPercentage = (this.totalMax > 0)
                    ? Math.round(((this.totalObtained * 100.0) / this.totalMax) * 100.0) / 100.0
                    : 0.0;

            this.passedOverall = this.overallPercentage >= this.passingThreshold;
            this.passedAllSubjects = allPassed;
            this.overallGrade = Subject.calculateGrade(this.overallPercentage);
            this.highestSubject = maxSub;
            this.lowestSubject = minSub;
        }

        public String getStudentName() { return studentName; }
        public List<Subject> getSubjects() { return subjects; }
        public double getTotalObtained() { return totalObtained; }
        public double getTotalMax() { return totalMax; }
        public double getOverallPercentage() { return overallPercentage; }
        public boolean isPassedOverall() { return passedOverall; }
        public boolean isPassedAllSubjects() { return passedAllSubjects; }
        public String getOverallGrade() { return overallGrade; }
        public Subject getHighestSubject() { return highestSubject; }
        public Subject getLowestSubject() { return lowestSubject; }

        public String toJson() {
            StringBuilder sb = new StringBuilder();
            sb.append("{");
            sb.append("\"student_name\":\"").append(escapeJson(studentName)).append("\",");
            sb.append("\"total_obtained\":").append(totalObtained).append(",");
            sb.append("\"total_max\":").append(totalMax).append(",");
            sb.append("\"overall_percentage\":").append(overallPercentage).append(",");
            sb.append("\"passed_overall\":").append(passedOverall).append(",");
            sb.append("\"passed_all_subjects\":").append(passedAllSubjects).append(",");
            sb.append("\"overall_grade\":\"").append(overallGrade).append("\",");
            sb.append("\"passing_threshold\":").append(passingThreshold).append(",");

            if (highestSubject != null) {
                sb.append("\"highest_subject\":{\"name\":\"").append(escapeJson(highestSubject.getName()))
                  .append("\",\"percentage\":").append(highestSubject.getPercentage()).append("},");
            }
            if (lowestSubject != null) {
                sb.append("\"lowest_subject\":{\"name\":\"").append(escapeJson(lowestSubject.getName()))
                  .append("\",\"percentage\":").append(lowestSubject.getPercentage()).append("},");
            }

            sb.append("\"subjects\":[");
            for (int i = 0; i < subjects.size(); i++) {
                Subject s = subjects.get(i);
                sb.append("{")
                  .append("\"name\":\"").append(escapeJson(s.getName())).append("\",")
                  .append("\"obtained_marks\":").append(s.getObtainedMarks()).append(",")
                  .append("\"max_marks\":").append(s.getMaxMarks()).append(",")
                  .append("\"percentage\":").append(s.getPercentage()).append(",")
                  .append("\"passed\":").append(s.isPassed()).append(",")
                  .append("\"grade\":\"").append(s.getGrade()).append("\"")
                  .append("}");
                if (i < subjects.size() - 1) sb.append(",");
            }
            sb.append("]}");
            return sb.toString();
        }

        private static String escapeJson(String s) {
            return s.replace("\\", "\\\\").replace("\"", "\\\"");
        }
    }

    /**
     * Interactive Terminal CLI
     */
    public static void runCli() {
        Scanner scanner = new Scanner(System.in);
        System.out.println("============================================================");
        System.out.println("          JAVA STUDENT MARKS & GRADE CALCULATOR (CLI)       ");
        System.out.println("============================================================");

        System.out.print("Hello, what is your name? ");
        String name = scanner.nextLine().trim();
        if (name.isEmpty()) name = "Student";

        System.out.print("Are the total marks for each subject the same? (yes/no) [yes]: ");
        String sameTotal = scanner.nextLine().trim().toLowerCase();
        boolean isUniform = !sameTotal.equals("no");

        double uniformMax = 100.0;
        if (isUniform) {
            while (true) {
                System.out.print("How much is the total marks for each subject?: ");
                try {
                    uniformMax = Double.parseDouble(scanner.nextLine().trim());
                    if (uniformMax > 0) break;
                    System.out.println("[!] Must be > 0.");
                } catch (NumberFormatException e) {
                    System.out.println("[!] Enter a valid number.");
                }
            }
        }

        List<Subject> subjects = new ArrayList<>();
        int index = 1;
        while (true) {
            System.out.print("\nName of subject " + index + " (or type 'done' to calculate): ");
            String subName = scanner.nextLine().trim();
            if (subName.equalsIgnoreCase("done") || subName.equalsIgnoreCase("none") || subName.isEmpty()) {
                if (subjects.isEmpty()) {
                    System.out.println("[!] Please enter at least one subject.");
                    continue;
                }
                break;
            }

            double maxMark = uniformMax;
            if (!isUniform) {
                while (true) {
                    System.out.print("Total marks for '" + subName + "': ");
                    try {
                        maxMark = Double.parseDouble(scanner.nextLine().trim());
                        if (maxMark > 0) break;
                        System.out.println("[!] Must be > 0.");
                    } catch (NumberFormatException e) {
                        System.out.println("[!] Enter a valid number.");
                    }
                }
            }

            double obtained = 0;
            while (true) {
                System.out.print("Marks obtained in '" + subName + "': ");
                try {
                    obtained = Double.parseDouble(scanner.nextLine().trim());
                    if (obtained < 0) {
                        System.out.println("[!] Marks cannot be negative.");
                        continue;
                    }
                    if (obtained > maxMark) {
                        System.out.println("[!] Error: Obtained marks (" + obtained + ") cannot exceed total (" + maxMark + ").");
                        continue;
                    }
                    break;
                } catch (NumberFormatException e) {
                    System.out.println("[!] Enter a valid number.");
                }
            }

            subjects.add(new Subject(subName, obtained, maxMark, 35.0));
            index++;
        }

        StudentReport report = new StudentReport(name, subjects, 35.0);

        System.out.println("\n============================================================");
        System.out.println("                 REPORT CARD: " + report.getStudentName().toUpperCase());
        System.out.println("============================================================");
        System.out.printf("%-20s | %-10s | %-8s | %-8s | %-8s%n", "Subject", "Obtained", "Max", "%", "Status");
        System.out.println("------------------------------------------------------------");

        for (Subject s : report.getSubjects()) {
            System.out.printf("%-20s | %-10.1f | %-8.1f | %-7.2f%% | %-8s%n",
                    s.getName(), s.getObtainedMarks(), s.getMaxMarks(), s.getPercentage(),
                    s.isPassed() ? "PASSED" : "FAILED");
        }

        System.out.println("------------------------------------------------------------");
        System.out.println("Total Marks         : " + report.getTotalObtained() + " / " + report.getTotalMax());
        System.out.println("Overall Percentage  : " + report.getOverallPercentage() + "%");
        System.out.println("Overall Grade       : " + report.getOverallGrade());
        System.out.println("Average Status      : " + (report.isPassedOverall() ? "PASSED in average" : "FAILED in average"));
        System.out.println("All Subjects Status : " + (report.isPassedAllSubjects() ? "PASSED in all subjects" : "FAILED in some subjects"));
        if (report.getHighestSubject() != null) {
            System.out.println("Highest Score       : " + report.getHighestSubject().getName() + " (" + report.getHighestSubject().getPercentage() + "%)");
        }
        if (report.getLowestSubject() != null) {
            System.out.println("Lowest Score        : " + report.getLowestSubject().getName() + " (" + report.getLowestSubject().getPercentage() + "%)");
        }
        System.out.println("============================================================");
        System.out.println("Thank you!");
    }

    /**
     * Standalone HTTP Server Mode
     */
    public static void startServer(int port) throws IOException {
        com.sun.net.httpserver.HttpServer server = com.sun.net.httpserver.HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/api/health", exchange -> {
            String resp = "{\"status\":\"healthy\",\"engine\":\"Java SE Embedded Server\",\"version\":\"2.0.0\"}";
            byte[] bytes = resp.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) { os.write(bytes); }
        });

        System.out.println("Java MarksCalculator Server listening on http://localhost:" + port);
        server.start();
    }

    public static void main(String[] args) {
        if (args.length > 0 && args[0].equals("--server")) {
            int port = args.length > 1 ? Integer.parseInt(args[1]) : 8080;
            try {
                startServer(port);
            } catch (IOException e) {
                System.err.println("Server error: " + e.getMessage());
            }
        } else {
            runCli();
        }
    }
}
