package com.dhes.service.impl;

import com.dhes.dto.UserDto;
import com.dhes.entity.User;
import com.dhes.mapper.UserMapper;
import com.dhes.repository.UserRepository;
import com.dhes.service.UserService;

import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserServiceImpl implements UserService {

		private final UserRepository userRepository;
		
		private UserMapper userMapper = new UserMapper();

	public UserServiceImpl(UserRepository userRepository) {
			this.userRepository = userRepository;
	}


	@Override
	public UserDto createUser(UserDto userDto) {
		User user = userMapper.toEntity(userDto);
		userRepository.save(user);
		return userDto;
	}

	@Override
	public UserDto getUserById(Long userId) {
		Optional<User> userOptinal = userRepository.findById(userId);
		try {
			User user = userOptinal.get();
			return userMapper.toDto(user);
		}
		catch (NoSuchElementException e) {
			System.err.println(e.getMessage());
			return null;
		}
	}

	@Override
	public List<UserDto> getAllUsers() {
		List<User> users = userRepository.findAll();
		List<UserDto> usersDto = new ArrayList<>();
		for (User user : users) usersDto.add(userMapper.toDto(user));
		return usersDto;
	}

	@Override
	public UserDto updateUser(Long userId, UserDto userDto) {
		Optional<User> userOptional = userRepository.findById(userId);
		try {
			User user = userOptional.get();
			user.setGrade(userDto.getGrade());
			return userDto;
		}
		catch (NoSuchElementException e) {
			System.err.println(e.getMessage());
			return null;
		}
	}

	@Override
	public void deleteUser(Long userId) {
		Optional<User> userOptional = userRepository.findById(userId);
		try {
			User user = userOptional.get();
			userRepository.delete(user);
		}
		catch (NoSuchElementException e) {
			System.err.println(e.getMessage());
		}
	}
}
