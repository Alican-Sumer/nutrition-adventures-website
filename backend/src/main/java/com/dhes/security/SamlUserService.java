package com.dhes.security;

import com.dhes.entity.User;
import com.dhes.repository.RoleRepository;
import com.dhes.repository.UserRepository;
import org.springframework.stereotype.Service;

/**
 * Handles user provisioning after Shibboleth/SAML authentication.
 * The IdP authenticates the user; this service finds or creates the local User record from SAML attributes.
 */
@Service
public class SamlUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public SamlUserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    /**
     * Find existing user by federated ID, or create one from SAML attributes.
     * Call this after successful SAML response (e.g. in a custom authentication success handler).
     *
     * @param federatedId stable ID from SAML (e.g. persistent NameID or eduPersonPrincipalName)
     * @param username    from SAML (e.g. uid or name)
     * @param email       from SAML mail attribute
     * @param displayName from SAML displayName or cn
     * @return the existing or newly created User
     */
    public User findOrCreateBySamlAttributes(String federatedId, String username, String email, String displayName) {
        return userRepository.findByFederatedId(federatedId)
                .map(existing -> {
                    existing.setUsername(username != null ? username : existing.getUsername());
                    existing.setEmail(email != null ? email : existing.getEmail());
                    existing.setDisplayName(displayName != null ? displayName : existing.getDisplayName());
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    User user = new User();
                    user.setFederatedId(federatedId);
                    user.setUsername(username != null ? username : federatedId);
                    user.setEmail(email);
                    user.setDisplayName(displayName);
                    // TODO: Assign default role(s) from roleRepository if needed
                    return userRepository.save(user);
                });
    }

    /**
     * Process SAML login: extract attributes from token, find/create user, establish session.
     * When adding spring-security-saml2-service-provider, use Saml2AuthenticationToken and map
     * token.getName() / token.getSaml2Response() attributes to findOrCreateBySamlAttributes(...).
     */
    public void processSamlLogin(Object samlToken) {
        // TODO: When SAML dependency is enabled, cast to Saml2AuthenticationToken, extract
        // federatedId (e.g. token.getName()), username, email, displayName from attributes,
        // call findOrCreateBySamlAttributes(...), then build UserDetails and set in SecurityContext
    }
}
