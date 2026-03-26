package com.dhes.controller;

import com.dhes.dto.CourseDto;
import com.dhes.dto.UserDto;
import com.dhes.service.CourseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CourseController.class)
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseService courseService;

    @Autowired
    private ObjectMapper objectMapper;

    private CourseDto courseDto;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        courseDto = new CourseDto();
        courseDto.setId(1L);
        courseDto.setName("Introduction to Java");

        userDto = new UserDto();
        userDto.setId(1L);
        userDto.setUsername("jdoe123");
    }

    @Test
    @WithMockUser
    void createCourse_ReturnsOk() throws Exception {
        // courseService.createCourse() is void, no stub needed
        mockMvc.perform(post("/api/courses")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(courseDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Introduction to Java"));
    }

    @Test
    @WithMockUser
    void getCourseById_WhenFound_ReturnsOk() throws Exception {
        when(courseService.getCourseById(1L)).thenReturn(courseDto);

        mockMvc.perform(get("/api/courses/1")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Introduction to Java"));
    }

    @Test
    @WithMockUser
    void getCourseById_WhenNotFound_Returns404() throws Exception {
        when(courseService.getCourseById(99L)).thenReturn(null);

        mockMvc.perform(get("/api/courses/99").with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void getAllCourses_ReturnsList() throws Exception {
        List<CourseDto> courses = Arrays.asList(courseDto);
        when(courseService.getAllCourses()).thenReturn(courses);

        mockMvc.perform(get("/api/courses").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Introduction to Java"));
    }

    @Test
    @WithMockUser
    void updateCourse_ReturnsUpdatedCourse() throws Exception {
        when(courseService.updateCourse(any(CourseDto.class))).thenReturn(courseDto);

        mockMvc.perform(put("/api/courses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(courseDto))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Introduction to Java"));
    }

    @Test
    @WithMockUser
    void deleteCourse_ReturnsOk() throws Exception {
        doNothing().when(courseService).deleteCourse(1L);

        mockMvc.perform(delete("/api/courses/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(""));
    }

    @Test
    @WithMockUser
    void addUser_ReturnsUpdatedCourse() throws Exception {
        when(courseService.addUser(1L, 1L)).thenReturn(courseDto);

        mockMvc.perform(put("/api/courses/1/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser
    void removeUser_ReturnsUpdatedCourse() throws Exception {
        when(courseService.removeUser(1L, 1L)).thenReturn(courseDto);

        mockMvc.perform(delete("/api/courses/1/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser
    void getUsers_ReturnsList() throws Exception {
        List<UserDto> users = Arrays.asList(userDto);
        when(courseService.getUsers(1L)).thenReturn(users);

        mockMvc.perform(get("/api/courses/1/students").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].username").value("jdoe123"));
    }
}