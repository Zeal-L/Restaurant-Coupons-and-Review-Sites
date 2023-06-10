package com.COMP3900Proj.Database;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.sql.*;

@Component
public class Database {

    static Boolean TableExist(String tableName, JdbcTemplate jdbcTemplate) {
        try {
            String query = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ?";
            int count = jdbcTemplate.queryForObject(query, Integer.class, tableName);
            return count > 0;
        } catch (NullPointerException e) {
            return false;
        }
    }
}
