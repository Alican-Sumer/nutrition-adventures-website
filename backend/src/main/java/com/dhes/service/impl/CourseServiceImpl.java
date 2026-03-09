package com.dhes.service.impl;

import com.dhes.dto.CourseDto;
import com.dhes.dto.UserDto;
import com.dhes.entity.Course;
import com.dhes.entity.User;
import com.dhes.mapper.CourseMapper;
import com.dhes.mapper.UserMapper;
import com.dhes.repository.CourseRepository;
import com.dhes.repository.UserRepository;
import com.dhes.service.CourseService;

import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.stereotype.Service;


@Service
@Transactional
public class CourseServiceImpl implements CourseService {
	
    private final CourseRepository courseRepository;
		private final UserRepository userRepository;
		
    private CourseMapper courseMapper = new CourseMapper();

		private UserMapper userMapper = new UserMapper();

	public CourseServiceImpl(CourseRepository courseRepository, UserRepository userRepository) {
			this.courseRepository = courseRepository;
			this.userRepository = userRepository;
	}


	@Override
	public CourseDto createCourse(CourseDto courseDto) {
		Course course = courseMapper.toEntity(courseDto);
		courseRepository.save(course);
		return courseDto;
	}

	@Override
	public CourseDto getCourseById(Long id) {
		Optional<Course> opt_course = courseRepository.findById(id);
		try {
			Course course = opt_course.get();
			CourseDto courseDto = courseMapper.toDto(course);
			return courseDto;
		}
		catch (NoSuchElementException e) {
			System.err.println(e.getMessage());
			return null;
		}
	}

	@Override
	public List<CourseDto> getAllCourses() {
		List<Course> courses = courseRepository.findAll();
		List<CourseDto> coursesDto = new ArrayList<>();
		for (Course course : courses) coursesDto.add(courseMapper.toDto(course));
		return coursesDto;
	}

	@Override
	public CourseDto updateCourse(CourseDto courseDto) {
		Optional<Course> opt_course = courseRepository.findById(courseDto.getId());
		try {
			Course course = opt_course.get();
			course.setName(courseDto.getName());
			course.setSection(courseDto.getSection());
			List<UserDto> usersDto = courseDto.getUsers();
			List<User> users = new ArrayList<>();
			for (UserDto userDto : usersDto) users.add(userMapper.toEntity(userDto));
			course.setUsers(users);
			courseRepository.save(course);
			return courseDto;
		}
		catch (NoSuchElementException e) {
			System.err.println(e.getMessage());
			return null;
		}
	}

	@Override
	public void deleteCourse(Long courseId) {
		Optional<Course> opt_course = courseRepository.findById(courseId);
		try {
			Course course = opt_course.get();
			courseRepository.delete(course);
		}
		catch (NoSuchElementException e) {
			System.err.println(e.getMessage());
		}
	}

	@Override
	public CourseDto addUser(Long courseId, Long userId) {
		Optional<Course> opt_course = courseRepository.findById(courseId);
		Optional<User> userOptional = userRepository.findById(userId);
		try {
			Course course = opt_course.get();
			User user = userOptional.get();
			List<User> users = course.getUsers();
			users.add(user);
			course.setUsers(users);
			courseRepository.save(course);
			return courseMapper.toDto(course);
		}
		catch (NoSuchElementException e) {
			System.err.println(e.getMessage());
			return null;
		}
	}

	@Override
	public CourseDto removeUser(Long courseId, Long userId) {
		Optional<Course> opt_course = courseRepository.findById(courseId);
		Optional<User> userOptional = userRepository.findById(userId);
		try {
			Course course = opt_course.get();
			User user = userOptional.get();
			List<User> users = course.getUsers();
			users.remove(user);
			course.setUsers(users);
			courseRepository.save(course);
			return courseMapper.toDto(course);
		}
		catch (NoSuchElementException e) {
			System.err.println(e.getMessage());
			return null;
		}
	}

	@Override
	public List<UserDto> getUsers(Long courseId) {
		Optional<Course> opt_course = courseRepository.findById(courseId);
		try {
			Course course = opt_course.get();
			List<User> users = course.getUsers();
			List<UserDto> usersDto = new ArrayList<>();
			for (User user : users) usersDto.add(userMapper.toDto(user));
			return usersDto;
		}
		catch (NoSuchElementException e) {
			System.err.println(e.getMessage());
			return null;
		}
	}

}
