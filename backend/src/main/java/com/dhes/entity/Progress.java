package com.dhes.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "progress")
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO: Add fields (user, course/game, completion, etc.)

    // TODO: Add getters, setters, constructors
}
