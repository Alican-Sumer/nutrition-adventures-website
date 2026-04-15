package com.dhes.entity;

import java.util.Collection;

import jakarta.persistence.*;

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
    private String displayName;

    private String email;

    private Double grade;

     /** User's roles */
    @ManyToMany ( fetch = FetchType.EAGER )
    @JoinTable ( name = "users_roles", joinColumns = @JoinColumn ( name = "user_id", referencedColumnName = "id" ),
            inverseJoinColumns = @JoinColumn ( name = "role_id", referencedColumnName = "id" ) )
    private Collection<Role> roles;
    
    public Collection<Role> getRoles() {
        return this.roles;
    }

    public void setRoles(Collection<Role> roles) {
        this.roles = roles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getGrade() {
        return grade;
    }

    public void setGrade(Double grade) {
        this.grade = grade;
    } 

    public String getFederatedId() {
        return federatedId;
    }

    public void setFederatedId(String federatedId) {
        this.federatedId = federatedId;
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

}
