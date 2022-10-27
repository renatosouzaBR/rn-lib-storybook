import React from "react";
import renderer from "react-test-renderer";

import { Button } from "./Button";

describe("Button component", () => {
  it("should render button component with title", () => {
    const tree = renderer.create(<Button title="test-title" />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});
