package web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import web.model.Role;
import web.model.User;
import web.service.RoleService;
import web.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AdminRestController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping()
    public List<User> showUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/principal")
    public User getPrincipal() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping(value = {"/editForm/{id}", "/deleteForm/{id}"})
    public User editForm(@PathVariable("id") int id) {
        User user = userService.getUserById(id);
        user.setRolesId(user.getRoles().stream().map(Role::getId).collect(Collectors.toSet()));
        return user;
    }

    @PostMapping("/add")
    @ResponseStatus(value = HttpStatus.OK)
    public void addUser(@RequestBody User user) {
        user.setRoles(user.getRolesId().stream().map(roleService::getRoleById).collect(Collectors.toSet()));
        userService.addUser(user);
    }

    @PutMapping("/edit")
    @ResponseStatus(value = HttpStatus.OK)
    public void editUser(@RequestBody User user) {
        user.setRoles(user.getRolesId().stream().map(roleService::getRoleById).collect(Collectors.toSet()));
        userService.updateUser(user);
    }

    @GetMapping("/delete/{id}")
    public void deleteUser(@PathVariable("id") int id) {
        userService.deleteUserById(id);
    }
}
