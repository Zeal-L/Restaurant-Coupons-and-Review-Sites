package com.COMP3900Proj.Database;

import com.COMP3900Proj.ApiFormat.ApiUser;
import com.COMP3900Proj.Errors.DataBaseError;
import com.COMP3900Proj.Errors.UserError;
import com.COMP3900Proj.JWT;
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
        if (!Database.TableExist("users", jdbcTemplate)) {
            String query = "CREATE TABLE users (id SERIAL PRIMARY KEY, email TEXT UNIQUE, name TEXT, password TEXT, gender TEXT);";
            jdbcTemplate.execute(query);
        }
    }

    public void register(ApiUser user) throws UserError, DataBaseError {
        try {
            if(checkIfEmailExists(user.getEmail())) {
                throw new UserError("User already exists");
            }
            String password = JWT.HashPassword(user.getPassword(), SOLID_KEY);
            String query = "INSERT INTO Users (email, name, password, gender) VALUES (?, ?, ?, ?)";
            PreparedStatement statement = jdbcTemplate.getDataSource().getConnection().prepareStatement(query);
            statement.setString(1, user.getEmail());
            statement.setString(2, user.getUsername());
            statement.setString(3, password);
            statement.setString(4, user.getGender());
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new DataBaseError("Failed to register user");
        }
    }

    public Boolean login(String username, String password) {
        try {
            password = JWT.HashPassword(password, SOLID_KEY);
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

    public Boolean checkIfEmailExists(String email) {
        try {
            String query = "SELECT COUNT(*) FROM Users WHERE email = ?";
            int count = jdbcTemplate.queryForObject(query, Integer.class, email);
            return count > 0;
        } catch (NullPointerException e) {
            return false;
        }
    }
}
