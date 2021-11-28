/*
default admin:
    username: admin@admin.com
    password: admin

default admin cannot be edited or deleted
*/

package web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import web.model.Role;
import web.model.User;
import web.service.RoleService;
import web.service.UserService;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.List;

@Component
public class DefaultAdmin {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public DefaultAdmin(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    public void addDefaultAdmin() {
        List<Role> roles = roleService.getAllRoles();
        if (roles.isEmpty()) {
            Role roleAdmin = new Role();
            Role roleUser = new Role();
            roleAdmin.setName("ROLE_ADMIN");
            roleUser.setName("ROLE_USER");
            roleService.addRole(roleAdmin);
            roleService.addRole(roleUser);
            roles.add(roleAdmin);
            roles.add(roleUser);
        }

        List<User> users = userService.getAllUsers();
        if (users.isEmpty()) {
            User admin = new User();
            admin.setFirstName("admin");
            admin.setLastName("admin");
            admin.setEmail("admin@admin.com");
            admin.setAge(100);
            admin.setPassword("admin");
            admin.setRoles(new HashSet<>(roles));
            userService.addUser(admin);
        }
    }
}
