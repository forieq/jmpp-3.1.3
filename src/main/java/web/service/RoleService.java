package web.service;

import web.model.Role;

import java.util.List;

public interface RoleService {

    void addRole(Role role);

    Role getRoleById(int id);

    List<Role> getAllRoles();
}
