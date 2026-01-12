package com.skillsprout.skill_sprout_backend.repository;

import com.skillsprout.skill_sprout_backend.entity.LoginStreak;
import com.skillsprout.skill_sprout_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginStreakRepository extends JpaRepository<LoginStreak, Long> {
    Optional<LoginStreak> findByUser(User user);
    Optional<LoginStreak> findByUserId(Long userId);
}