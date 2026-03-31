package com.dhes.service.impl;

import com.dhes.dto.CourseDto;
import com.dhes.entity.Course;
import com.dhes.entity.User;
import com.dhes.repository.CourseRepository;
import com.dhes.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceImplTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CourseServiceImpl courseService;

    private Course course;
    private CourseDto courseDto;

    @BeforeEach
    void setUp() {
        course = new Course();
        course.setId(1L);
        course.setName("Java 101");
        course.setSection("A");
        course.setUsers(new ArrayList<>());

        courseDto = new CourseDto();
        courseDto.setId(1L);
        courseDto.setName("Java 101");
        courseDto.setSection("A");
    }

    @Test
    void getCourseById_Success() {
        // Arrange
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // Act
        CourseDto result = courseService.getCourseById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Java 101", result.getName());
        verify(courseRepository, times(1)).findById(1L);
    }

    @Test
    void getCourseById_NotFound_ReturnsNull() {
        // Arrange
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        CourseDto result = courseService.getCourseById(1L);

        // Assert
        assertNull(result);
    }

    @Test
    void createCourse_Success() {
        // Act
        CourseDto result = courseService.createCourse(courseDto);

        // Assert
        assertNotNull(result);
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    void addUser_Success() {
        // Arrange
        User user = new User();
        user.setId(10L);
        
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));

        // Act
        CourseDto result = courseService.addUser(1L, 10L);

        // Assert
        assertNotNull(result);
        verify(courseRepository, times(1)).save(course);
        // Verify user was added to the list
        assertTrue(course.getUsers().contains(user));
    }

    @Test
    void deleteCourse_Success() {
        // Arrange
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // Act
        courseService.deleteCourse(1L);

        // Assert
        verify(courseRepository, times(1)).delete(course);
    }
}