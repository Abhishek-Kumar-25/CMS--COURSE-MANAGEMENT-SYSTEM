package com.skillsprout.skill_sprout_backend.dto;

public class AuthResponse {
    private String message;
    private String token;
    private String username;
    private Integer level;
    private Integer experience;

    public AuthResponse(String message) {
        this.message = message;
    }

    public AuthResponse(String message, String token, String username, Integer level, Integer experience) {
        this.message = message;
        this.token = token;
        this.username = username;
        this.level = level;
        this.experience = experience;
    }

    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }
}