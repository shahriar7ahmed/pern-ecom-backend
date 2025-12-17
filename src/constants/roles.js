/**
 * User role constants
 */

export const USER_ROLES = {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER'
};

export const isValidRole = (role) => {
    return Object.values(USER_ROLES).includes(role);
};
