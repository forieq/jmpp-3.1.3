package web.dao;

import web.model.User;

import java.util.List;

public interface UserDao {

    void addUser(User user);

    User getUserById(int id);

    User getUserByEmail(String email);

    void updateUser(User user);

    void deleteUserById(int id);

    List<User> getAllUsers();
}
