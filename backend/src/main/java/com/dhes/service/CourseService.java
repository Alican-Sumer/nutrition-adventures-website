package com.dhes.service;

import java.util.List;

import com.dhes.dto.CourseDto;
import com.dhes.dto.UserDto;

public interface CourseService {

    public CourseDto createCourse(CourseDto courseDto);
    public CourseDto getCourseById(Long id);
    public List<CourseDto> getAllCourses();
    public CourseDto updateCourse(CourseDto course );
    public void deleteCourse(Long courseId);
    public CourseDto addUser(Long courseId, Long userId);
    public CourseDto removeUser(Long courseId, Long userId);
    public List<UserDto> getUsers(Long courseId);
}
