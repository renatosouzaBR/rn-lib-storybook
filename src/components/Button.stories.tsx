import { storiesOf } from "@storybook/react-native";
import { text } from "@storybook/addon-knobs";

import { Button } from "./Button";

storiesOf("Button", module).add("default", () => (
  <Button title={text("title", "ENTRAR")} />
));
