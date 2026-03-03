package com.dhes.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "grades")
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO: Add fields (user, course/game, score, etc.)

    // TODO: Add getters, setters, constructors
}
