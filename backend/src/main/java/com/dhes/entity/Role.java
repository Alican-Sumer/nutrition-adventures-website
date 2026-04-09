package com.dhes.entity;

import jakarta.persistence.*;

@Entity
@Table ( name = "roles" )
public class Role {

    /** Role id */
    @Id
    @GeneratedValue ( strategy = GenerationType.IDENTITY )
    private Long   id;

    /** Roll name */
    private String name;

    public void setName(String name) {
      this.name = name;
    }
    public void setId(Long id) {
      this.id = id;
    }
    
    public String getName() {
      return this.name;
    }
    public Long getId() {
      return this.id;
    }
    
}