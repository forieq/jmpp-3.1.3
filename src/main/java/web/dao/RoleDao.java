package web.dao;

import web.model.Role;

import java.util.List;

public interface RoleDao {

    void addRole(Role role);

    Role getRoleById(int id);

    List<Role> getAllRoles();
}
