package com.dhes.repository;

import com.dhes.entity.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Long> {

    Optional<GameSession> findByUserIdAndCourseId(Long userId, Long courseId);
}
