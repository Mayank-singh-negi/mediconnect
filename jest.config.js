module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  maxWorkers: 1,
  workerIdleMemoryLimit: '512MB',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!(@nestjs|rxjs|typeorm|class-validator|class-transformer|uuid)/)'],
};
