export default {
  resolve: {
    // Avoids Vite's Windows realpath probe (`net use`) in restricted environments.
    preserveSymlinks: true,
  },
  // This site has no bare module imports, so dependency pre-bundling is unnecessary.
  optimizeDeps: {
    noDiscovery: true,
  },
};
