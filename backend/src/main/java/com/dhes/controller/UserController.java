package com.dhes.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dhes.dto.UserDto;
import com.dhes.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {


    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/sync")
    public ResponseEntity<UserDto> syncUser(
        @RequestHeader(value = "X-SHIB-UID") String unityId,
        @RequestHeader(value = "X-SHIB-MAIL") String email,
        @RequestHeader(value = "X-SHIB-DISPLAYNAME") String name
        

    ) {
        // Check if user exists in your DB by unityId
        // If not, create them using the data from the headers
        UserDto userDto = new UserDto();
        userDto.setFederatedID(unityId);
        userDto.setEmail(email);
        userDto.setDisplayName(name);

        
        return ResponseEntity.ok(userService.createUser(userDto));
    }


    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.createUser(userDto));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable ("userId")Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(@PathVariable ("userId") Long userId, @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(userId, userDto));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable ("userId")Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("");
    }

    // when we implement roles this will be used
    // @PostMapping("/{userId}/{role}")
    // public ResponseEntity<UserDto> addRole(@PathVariable ("userId") Long userId, @PathVariable ("role") Role role) {
        
    // }

    // @DeleteMapping("/{userId}/{role}")
    // public ResponseEntity<UserDto> deleteRole(@PathVariable ("userId") Long userId, @PathVariable ("role") Role role) {

    // }


}
