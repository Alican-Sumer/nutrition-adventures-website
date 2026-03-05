package com.dhes.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Stable identifier from Shibboleth/SAML (e.g. persistent NameID or eduPersonPrincipalName). Used to look up user after SSO login. */
    @Column(name = "federated_id", unique = true, nullable = false)
    private String federatedId;

    @Column(nullable = false)
    private String username;

    private String email;

    private String displayName;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<GameSession> gameSessions;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<Grade> grades;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFederatedId() {
        return federatedId;
    }

    public void setFederatedId(String federatedId) {
        this.federatedId = federatedId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public Set<GameSession> getGameSessions() {
        return gameSessions;
    }

    public void setGameSessions(Set<GameSession> gameSessions) {
        this.gameSessions = gameSessions;
    }

    public Set<Grade> getGrades() {
        return grades;
    }

    public void setGrades(Set<Grade> grades) {
        this.grades = grades;
    }
}
