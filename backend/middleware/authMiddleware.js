const { checkPermission, requireAdmin, requireEditor, requireAuth, ROLE_HIERARCHY } = require('./rbacMiddleware');

// Alias for consistency with user request
const verifyAdmin = requireAdmin;

module.exports = {
    checkPermission,
    requireAdmin,
    verifyAdmin,
    requireEditor,
    requireAuth,
    ROLE_HIERARCHY
};
