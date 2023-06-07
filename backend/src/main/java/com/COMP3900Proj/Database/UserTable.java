package com.COMP3900Proj.Database;

import com.COMP3900Proj.JWT;
import com.COMP3900Proj.Token;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.*;

@Repository
public class UserTable {
    private final JdbcTemplate jdbcTemplate;
    private static final String SOLID_KEY = "ThisIsASolidKeyForSigningJWT";

    @Autowired
    public UserTable(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String register(String username, String password) {
        try {
            if(checkIfUserExists(username)) {
                return null;
            }
            password = JWT.HashPassword(password,SOLID_KEY);
            String query = "INSERT INTO Users (Username, Password) VALUES (?, ?)";
            PreparedStatement statement = jdbcTemplate.getDataSource().getConnection().prepareStatement(query);
            statement.setString(1, username);
            statement.setString(2, password);
            statement.executeUpdate();

            query = "SELECT id FROM Users WHERE Username = ?";
            int id = jdbcTemplate.queryForObject(query, Integer.class, username);
            return Token.GanerateToken(id).getToken();
        } catch (SQLException e) {
            return null;
        }
    }

    public Boolean login(String username, String password) {
        try {
            password = JWT.HashPassword(password,SOLID_KEY);
            if (username == null || password == null) {
                return false;
            }
            String query = "SELECT COUNT(*) FROM Users WHERE Username = ? AND Password = ?";
            int count = jdbcTemplate.queryForObject(query, Integer.class, username, password);
            return count > 0;
        } catch (NullPointerException e) {
            return false;
        }
    }

    public Boolean checkIfUserExists(String username) {
        try {
            String query = "SELECT COUNT(*) FROM Users WHERE Username = ?";
            int count = jdbcTemplate.queryForObject(query, Integer.class, username);
            return count > 0;
        } catch (NullPointerException e) {
            return false;
        }
    }
}
