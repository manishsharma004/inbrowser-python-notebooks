/**
 * @typedef {'file' | 'directory'} VfsNodeType
 */

/**
 * @typedef {Object} VfsNode
 * @property {string} id
 * @property {string} name
 * @property {VfsNodeType} type
 * @property {string | null} parentId
 * @property {number} updatedAt
 * @property {string} [content] - UTF-8 text for files
 * @property {string} [mimeType]
 */

/**
 * @typedef {Object} VfsSnapshot
 * @property {string} rootId
 * @property {VfsNode[]} nodes
 */

export {};
