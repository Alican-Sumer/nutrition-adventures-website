package com.dhes.dto;

import java.util.List;

public class CourseDto {

    private Long id;
    private String name;
    private String section;
    private List<UserDto> users;
    private String code;

    // Getters
    public String getCode() {
        return code;
    }
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSection() {
        return section;
    }

    public List<UserDto> getUsers() {
        return users;
    }

    // Setters
    public void setCode(String code) {
        this.code = code;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public void setUsers(List<UserDto> users) {
        this.users = users;
    }
}