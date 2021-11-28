package web.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import web.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {

    void addUser(User user);

    User getUserById(int id);

    User getUserByEmail(String email);

    void updateUser(User user);

    void deleteUserById(int id);

    List<User> getAllUsers();
}
