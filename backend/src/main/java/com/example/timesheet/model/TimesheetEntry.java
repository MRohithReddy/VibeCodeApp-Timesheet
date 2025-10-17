package com.example.timesheet.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
public class TimesheetEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String employeeName;

    @NotBlank
    private String project;

    @NotNull
    private LocalDate workDate;

    @Min(0)
    @Max(24)
    private int hours;

    @Size(max = 500)
    private String notes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getProject() { return project; }
    public void setProject(String project) { this.project = project; }

    public LocalDate getWorkDate() { return workDate; }
    public void setWorkDate(LocalDate workDate) { this.workDate = workDate; }

    public int getHours() { return hours; }
    public void setHours(int hours) { this.hours = hours; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}


