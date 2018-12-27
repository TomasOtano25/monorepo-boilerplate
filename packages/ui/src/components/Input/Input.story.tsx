import * as React from "react";

import { storiesOf } from "@storybook/react";
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

// import { Welcome } from '@storybook/react/demo';
import { Input } from "./index";

storiesOf("Input", module).add("basic example", () => <Input />);
