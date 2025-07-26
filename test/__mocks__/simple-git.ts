const simpleGit = jest.fn(() => ({
  status: jest.fn(() =>
    Promise.resolve({
      files: [
        { path: 'another.md', index: ' ', working_dir: ' ' },
        { path: 'nested/nested.md', index: ' ', working_dir: ' ' },
        { path: 'test.md', index: ' ', working_dir: ' ' },
      ],
    }),
  ),
}));

export default simpleGit;
