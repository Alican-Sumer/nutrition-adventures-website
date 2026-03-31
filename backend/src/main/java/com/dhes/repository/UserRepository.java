package com.dhes.repository;

import com.dhes.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Look up by SAML/Shibboleth stable identifier (e.g. persistent NameID or eduPersonPrincipalName). */
    Optional<User> findByFederatedId(String federatedId);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}
