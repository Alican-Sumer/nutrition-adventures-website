package com.dhes.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "game_sessions",
       uniqueConstraints = @UniqueConstraint(name = "uq_game_sessions_user_course", columnNames = {"user_id", "course_id"}))
public class GameSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(name = "current_checkpoint", nullable = false)
    private short currentCheckpoint;

    @Column(name = "current_progress_pct", nullable = false)
    private short currentProgressPct;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public short getCurrentCheckpoint() {
        return currentCheckpoint;
    }

    public void setCurrentCheckpoint(short currentCheckpoint) {
        this.currentCheckpoint = currentCheckpoint;
    }

    public short getCurrentProgressPct() {
        return currentProgressPct;
    }

    public void setCurrentProgressPct(short currentProgressPct) {
        this.currentProgressPct = currentProgressPct;
    }
}
