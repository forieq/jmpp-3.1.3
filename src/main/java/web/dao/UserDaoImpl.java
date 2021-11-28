package web.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import web.model.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

@Repository
public class UserDaoImpl implements UserDao {

    @PersistenceContext
    private EntityManager entityManager;

    private PasswordEncoder passwordEncoder;

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        entityManager.persist(user);
    }

    @Override
    public User getUserById(int id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public User getUserByEmail(String email) {
        Query query = entityManager
                .createQuery("select distinct u from User u left join fetch u.roles where u.email = :email");
        query.setParameter("email", email);
        User user = (User) query.getSingleResult();
        return entityManager.find(User.class, user.getId());
    }

    @Override
    public void updateUser(User user) {
        String checkPassword = user.getPassword();
        if (checkPassword.charAt(0) != '$') {
            user.setPassword(passwordEncoder.encode(checkPassword));
        }
        entityManager.merge(user);
    }

    @Override
    public void deleteUserById(int id) {
        entityManager.remove(getUserById(id));
    }

    @Override
    public List<User> getAllUsers() {
        return entityManager
                .createQuery("select distinct u from User u left join fetch u.roles", User.class).getResultList();
    }
}
