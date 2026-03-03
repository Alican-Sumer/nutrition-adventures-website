package com.dhes.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "game_sessions")
public class GameSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO: Add fields (user, game, start/end time, score, etc.)

    // TODO: Add getters, setters, constructors
}
