package com.dhes.mapper;

import com.dhes.dto.CourseDto;
import com.dhes.dto.UserDto;
import com.dhes.entity.Course;
import com.dhes.entity.User;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;




@Component
public class CourseMapper {

    private UserMapper userMapper = new UserMapper();

    public CourseDto toDto(Course course) {
        CourseDto courseDto = new CourseDto();
        courseDto.setId(course.getId());
        courseDto.setName(course.getName());
        courseDto.setSection(course.getSection());
        courseDto.setCode(course.getCode());
        List<UserDto> usersDto = new ArrayList<>();
        for (User user: course.getUsers()) usersDto.add(userMapper.toDto(user));
        courseDto.setUsers(usersDto);
        return courseDto;
    }

    public Course toEntity(CourseDto courseDto) {
        Course course = new Course();
        course.setId(courseDto.getId());
        course.setName(courseDto.getName());
        course.setCode(courseDto.getSection());
        course.setSection(courseDto.getSection());
        List<User> users = new ArrayList<>();
        for (UserDto userDto: courseDto.getUsers()) users.add(userMapper.toEntity(userDto));
        course.setUsers(users);
        return course;
    }
}
