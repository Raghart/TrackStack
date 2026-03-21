import { createSystem, defineConfig } from "@chakra-ui/react";
import { defaultConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "html": {
      color: "white",
    },
  }
})

export default createSystem(defaultConfig, config);
