package com.dhes.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO: Add fields (name, course relation, etc.)

    // TODO: Add getters, setters, constructors
}
