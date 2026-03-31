package com.dhes.service;

import java.util.List;

import com.dhes.dto.UserDto;

public interface UserService {

    public UserDto createUser(UserDto userDto);
    public UserDto getUserById(Long userId);
    public List<UserDto>getAllUsers();
    public UserDto updateUser(Long userId, UserDto userDto);
    public void deleteUser(Long userId);

}
