/**
 * Resolves an image path to a full URL pointing to the API server.
 * If the path is already a full URL or a data URI, it returns it as is.
 * 
 * @param {string} path - The image path (e.g., '/uploads/avatar.jpg')
 * @returns {string} - The full URL (e.g., 'http://localhost:5000/uploads/avatar.jpg')
 */
export const getApiImageUrl = (path) => {
    if (!path) return '/default-avatar.png';

    // Check if it's already a full URL or data URI
    if (path.startsWith('http') || path.startsWith('data:')) {
        return path;
    }

    // Get API base URL from env
    // Default to localhost:5000 if not set
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // We need the server root (http://localhost:5000), not the API root (http://localhost:5000/api)
    // because static files are served from /uploads, not /api/uploads
    if (baseUrl.endsWith('/api')) {
        baseUrl = baseUrl.substring(0, baseUrl.length - 4);
    }

    // Remove trailing slash if present
    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
    }

    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${baseUrl}${cleanPath}`;
};
