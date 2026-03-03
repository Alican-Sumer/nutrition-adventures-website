package com.dhes.mapper;

import com.dhes.dto.UserDto;
import com.dhes.entity.User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    /** Map entity to DTO for API responses. No federatedId or password exposed. */
    public UserDto toDto(User entity) {
        if (entity == null) return null;
        UserDto dto = new UserDto();
        dto.setId(entity.getId());
        dto.setUsername(entity.getUsername());
        dto.setEmail(entity.getEmail());
        dto.setDisplayName(entity.getDisplayName());
        if (entity.getRoles() != null) {
            dto.setRoles(entity.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toSet()));
        } else {
            dto.setRoles(Collections.emptySet());
        }
        return dto;
    }

    /**
     * Map DTO to entity for create/update. federatedId is never set from client;
     * it is set from SAML when provisioning via SamlUserService.
     */
    public User toEntity(UserDto dto) {
        if (dto == null) return null;
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setDisplayName(dto.getDisplayName());
        // federatedId and roles set separately (e.g. from SAML or admin)
        return user;
    }
}
