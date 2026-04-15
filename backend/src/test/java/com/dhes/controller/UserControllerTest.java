package com.dhes.controller;

import com.dhes.dto.UserDto;
import com.dhes.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.HashSet;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserDto userDto;

    @BeforeEach
    void setUp() {
        userDto = new UserDto();
        userDto.setId(1L);
        userDto.setFederatedID("jdoe123"); // Added missing field
        userDto.setEmail("jdoe@example.com");
        userDto.setDisplayName("John Doe");
        userDto.setGrade(95.0);
        userDto.setRoles(new HashSet<>(Arrays.asList("STUDENT")));
    }

    @Test
    @WithMockUser
    void createUser_ReturnsOk() throws Exception {
        when(userService.createUser(any(UserDto.class))).thenReturn(userDto);

        mockMvc.perform(post("/api/users")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk())
                // Updated jsonPaths to match UserDto fields
                .andExpect(jsonPath("$.federatedID").value("jdoe123"))
                .andExpect(jsonPath("$.email").value("jdoe@example.com"))
                .andExpect(jsonPath("$.displayName").value("John Doe"))
                .andExpect(jsonPath("$.grade").value(95.0));
    }

    @Test
    @WithMockUser
    void getUserById_ReturnsUser() throws Exception {
        when(userService.getUserById(1L)).thenReturn(userDto);

        mockMvc.perform(get("/api/users/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.federatedID").value("jdoe123"))
                .andExpect(jsonPath("$.email").value("jdoe@example.com"));
    }

    @Test
    @WithMockUser
    void updateUser_ReturnsUpdatedUser() throws Exception {
        when(userService.updateUser(eq(1L), any(UserDto.class))).thenReturn(userDto);

        mockMvc.perform(post("/api/users/1") // Note: Consider @PutMapping for updates instead of @PostMapping
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.displayName").value("John Doe"))
                .andExpect(jsonPath("$.grade").value(95.0));
    }

    @Test
    @WithMockUser
    void getAllUsers_ReturnsList() throws Exception {
        when(userService.getAllUsers()).thenReturn(Arrays.asList(userDto));

        mockMvc.perform(get("/api/users").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].federatedID").value("jdoe123"))
                .andExpect(jsonPath("$[0].email").value("jdoe@example.com"))
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @WithMockUser
    void deleteUser_ReturnsOk() throws Exception {
        mockMvc.perform(delete("/api/users/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(""));
    }
}