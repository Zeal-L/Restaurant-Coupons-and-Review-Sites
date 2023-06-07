package com.COMP3900Proj.Database;

import org.springframework.stereotype.Component;

import java.sql.*;

@Component
public class Database {

    static Boolean TableExist(String tableName, String url) {
        try {
            tableName = tableName.toLowerCase();
            Connection connection = DriverManager.getConnection(url);
            DatabaseMetaData metaData = connection.getMetaData();
            ResultSet resultSet = metaData.getTables(null, null, tableName, null);
            return resultSet.next();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
