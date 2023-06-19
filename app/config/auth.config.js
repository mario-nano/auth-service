module.exports = {
    secret: "w!z%C*F-JaNdRfUjXn2r5u8x/A?D(G+KbPeShVkYp3s6v9y$B&E)H@McQfTjWnZq4t7w!z%C*F-JaNdRgUkXp2s5u8x/A?D(G+KbPeShVmYq3t6w9y$B&E)H@McQfTjW",
    sessionSecret: "a!z%C*F-JaNdSRfUjXn2r5u8x/A?D(G+K#FB32bPeSh5VkYp3sfrfTqQqwew6v9y$B&E)H@McQfTjWnZq4t7w!z%C*F-JaNdRgUkXp2s5u8x/A?D(G+KbPeShVmYq3t6w9y$B&E)H@McQfTjWf",

    // jwtExpiration: 3600,         // 1 hour
    // jwtRefreshExpiration: 86400, // 24 hours

    /* for development */
    jwtExpiration: 36000,          // 1 minute
    jwtRefreshExpiration: 86400 * 1000,  // 2 minutes
    confirmTokenExpiration: 86400,  // 24 hours

    emailHost: 'temuujin.e-nomads.com',
    emailPort: 465,
    adminEmailAddress: 'becs-admin@e-nomads.com',
    adminEmailPassword: 'GvG!$MB5Fx!X'
};
