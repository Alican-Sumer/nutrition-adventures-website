package com.dhes.mapper;

import com.dhes.dto.UserDto;
import com.dhes.entity.User;
import org.springframework.stereotype.Component;


@Component
public class UserMapper {

    /** Map entity to DTO for API responses. No federatedId or password exposed. */
    public UserDto toDto(User entity) {
        if (entity == null) return null;
        UserDto dto = new UserDto();
        dto.setId(entity.getId());
        dto.setEmail(entity.getEmail());
        dto.setDisplayName(entity.getDisplayName());
        dto.setGrade(entity.getGrade());
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
        user.setEmail(dto.getEmail());
        user.setDisplayName(dto.getDisplayName());
        user.setGrade(dto.getGrade());
        // federatedId and roles set separately (e.g. from SAML or admin)
        return user;
    }
}
