package com.example.timesheet.controller;

import com.example.timesheet.model.TimesheetEntry;
import com.example.timesheet.repository.TimesheetEntryRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/timesheets")
public class TimesheetController {
    private final TimesheetEntryRepository repository;

    public TimesheetController(TimesheetEntryRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<TimesheetEntry> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<TimesheetEntry> create(@Valid @RequestBody TimesheetEntry entry) {
        TimesheetEntry saved = repository.save(entry);
        return ResponseEntity.created(URI.create("/api/timesheets/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimesheetEntry> update(@PathVariable Long id, @Valid @RequestBody TimesheetEntry entry) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setEmployeeName(entry.getEmployeeName());
                    existing.setProject(entry.getProject());
                    existing.setWorkDate(entry.getWorkDate());
                    existing.setHours(entry.getHours());
                    existing.setNotes(entry.getNotes());
                    TimesheetEntry saved = repository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}


