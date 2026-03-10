package com.dhes.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
    private UserService userService;

    public CourseController(CourseService courseService, UserService userService) {
        this.courseService = courseService;
        this.userService = userService;
    }

    @PostMapping
    private ResponseEntity<CourseDto> createCourse(CourseDto courseDto) {
        this.courseService.createCourse(courseDto);
        return ResponseEntity.ok(courseDto);
    }

    @GetMapping
    public ResponseEntity<CourseDto> getCourseById(Long courseId) {
        CourseDto courseDto = this.courseService.getCourseById(courseId);
        if (courseDto != null) return ResponseEntity.ok(courseDto);
        else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        
    }
+ updateCourse(Long): CourseDto
+ deleteCourse(Long): void
+ addUser(Long, Long): CourseDto
+ removeUser(Long, Long): CourseDto
+ getUsers(Long): List<User>
}
