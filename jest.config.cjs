module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        verbatimModuleSyntax: false,
        module: 'commonjs',
        moduleResolution: 'node',
        resolveJsonModule: true,
        target: 'es2022',
        lib: ['es2022', 'dom'],
        types: ['jest', 'node'],
        jsx: 'react-jsx'
      }
    }],
  },
};
