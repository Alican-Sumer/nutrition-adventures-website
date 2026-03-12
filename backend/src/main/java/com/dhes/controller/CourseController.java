package com.dhes.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dhes.dto.CourseDto;
import com.dhes.dto.UserDto;
import com.dhes.entity.Course;
import com.dhes.service.CourseService;
import com.dhes.service.UserService;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    private ResponseEntity<CourseDto> createCourse(CourseDto courseDto) {
        this.courseService.createCourse(courseDto);
        return ResponseEntity.ok(courseDto);
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable ("courseId")Long courseId) {
        CourseDto courseDto = this.courseService.getCourseById(courseId);
        if (courseDto != null) return ResponseEntity.ok(courseDto);
        else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping()
    public ResponseEntity<List<CourseDto>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<CourseDto> updateCourse(CourseDto courseDto) {
        return ResponseEntity.ok(courseService.updateCourse(courseDto));
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<String> deleteCourse(Long courseId) {
        courseService.deleteCourse(courseId);
        return ResponseEntity.ok("");
    }

    @PutMapping("/{courseId}/{userId}")
    public ResponseEntity<CourseDto> addUser(Long courseId, Long userId) {
        return ResponseEntity.ok(courseService.addUser(courseId, userId));
    }

    @DeleteMapping("/{courseId}/{userId}")
    public ResponseEntity<CourseDto> removeUser(Long courseId, Long userId) {
        return ResponseEntity.ok(courseService.removeUser(courseId, userId));
    }

    @GetMapping( "/{courseId}/students")
    public ResponseEntity<List<UserDto>> getUsers(@PathVariable ("courseId")Long courseId) {
        return ResponseEntity.ok(courseService.getUsers(courseId));
    }
}
