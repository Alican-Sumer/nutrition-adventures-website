package com.dhes.dto;

import java.util.Set;

/** DTO for user data returned to the client. No password; users are authenticated via Shibboleth/SAML. */
public class UserDto {

    private Long id;
    private String FederatedId;
    private String email;
    private String displayName;
    private Set<String> roles;
    private double grade;


    public void setFederatedID(String federatedId) {
        this.FederatedId = federatedId;
    }

    public String getFederatedID() {
        return FederatedId;
    }

    public Double getGrade() {
        return grade;
    }

    public void setGrade(double grade) {
        this.grade = grade;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
