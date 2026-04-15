package com.dhes.service.impl;
import com.dhes.dto.UserDto;
import com.dhes.entity.User;
import com.dhes.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private UserServiceImpl userService;
    private User user;
    private UserDto userDto;
    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setGrade(99.0);
        userDto = new UserDto();
        userDto.setGrade(57.3);
    }
    
    @Test
    void createUser_ShouldReturnUserDto() {
        // Act
        UserDto result = userService.createUser(userDto);
        // Assert
        assertNotNull(result);
        assertEquals(userDto.getGrade(), result.getGrade());
        verify(userRepository, times(1)).save(any(User.class));
    }
    @Test
    void getUserById_Success_ShouldReturnDto() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        // Act
        UserDto result = userService.getUserById(1L);
        // Assert
        assertNotNull(result);
        assertEquals(99.0, result.getGrade());
    }
    @Test
    void getUserById_NotFound_ShouldReturnNull() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        // Act
        UserDto result = userService.getUserById(1L);
        // Assert
        assertNull(result, "Service should return null when user is not found due to catch block");
    }
    @Test
    void getAllUsers_ShouldReturnList() {
        // Arrange
        when(userRepository.findAll()).thenReturn(Collections.singletonList(user));
        // Act
        List<UserDto> result = userService.getAllUsers();
        // Assert
        assertEquals(1, result.size());
        verify(userRepository, times(1)).findAll();
    }
    @Test
    void updateUser_Success_ShouldReturnDto() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        UserDto updateInfo = new UserDto();
        updateInfo.setGrade(80);
        // Act
        UserDto result = userService.updateUser(1L, updateInfo);
        // Assert
        assertNotNull(result);
        assertEquals(80, user.getGrade()); // Verifies the entity was actually updated
        assertEquals(80, result.getGrade());
    }
    @Test
    void deleteUser_Success_ShouldCallDelete() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        // Act
        userService.deleteUser(1L);
        // Assert
        verify(userRepository, times(1)).delete(user);
    }
    @Test
    void deleteUser_NotFound_ShouldHandleGracefully() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        // Act & Assert
        assertDoesNotThrow(() -> userService.deleteUser(1L));
        verify(userRepository, never()).delete(any());
    }
}