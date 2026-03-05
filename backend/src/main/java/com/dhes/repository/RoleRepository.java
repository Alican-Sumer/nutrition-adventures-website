package com.dhes.repository;

import com.dhes.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    // TODO: Add custom query methods (e.g. findByName)
}
