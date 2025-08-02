const mermaid = {
  initialize: jest.fn(),
  render: jest.fn(() => Promise.resolve({ svg: '<svg></svg>' })),
};

export default mermaid;
