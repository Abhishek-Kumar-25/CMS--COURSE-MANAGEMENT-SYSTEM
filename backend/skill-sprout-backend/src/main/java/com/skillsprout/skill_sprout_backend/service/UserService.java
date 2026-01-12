package com.skillsprout.skill_sprout_backend.service;

import com.skillsprout.skill_sprout_backend.entity.LoginStreak;
import com.skillsprout.skill_sprout_backend.entity.User;
import com.skillsprout.skill_sprout_backend.repository.LoginStreakRepository;
import com.skillsprout.skill_sprout_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoginStreakRepository loginStreakRepository;

    public User createUser(String username, String email, String password, String companionType) {
        // Check if user already exists
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user (store password as plain text for now)
        User user = new User(username, email, password);
        if (companionType != null) {
            user.setCompanionType(companionType);
        }

        // Create login streak for user
        LoginStreak streak = new LoginStreak(user);
        userRepository.save(user);
        loginStreakRepository.save(streak);

        return user;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean validateUser(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            // Simple password check (plain text for now)
            return user.get().getPassword().equals(password);
        }
        return false;
    }

    public void addExperience(User user, Integer experience) {
        user.setExperience(user.getExperience() + experience);

        // Level up logic (simplified: 1000 XP per level)
        if (user.getExperience() >= user.getLevel() * 1000) {
            user.setLevel(user.getLevel() + 1);
        }

        userRepository.save(user);
    }
}