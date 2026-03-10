package com.dhes.controller;

import java.util.List;

import org.springframework.data.domain.jaxb.SpringDataJaxb.OrderDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dhes.dto.UserDto;
import com.dhes.entity.Course;
import com.dhes.service.CourseService;
import com.dhes.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {


    private UserService userService;
    private CourseService courseService;

    public UserController(UserService userService, CourseService courseService) {
        this.userService = userService;
        this.courseService = courseService;
    }
+ createUser(): UserDto
+ getUserById(Long): UserDto
+ getAllUsers(): List<UserDto>
+ updateUser(Long, UserDto): UserDto
+ deleteUser(Long): void
+ addRole(Long, Role): UserDto
+ deleteRole(Long, Role): UserDto
+ enrollUser(Long, Long): boolean
+ removeUserFromClass(Long, Long): boolean
}
