const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // adiciona nossas tasks personalizadas
      on("task", {
        getNextId() {
          const filePath = path.resolve("cypress/fixtures/counter.json");

          // cria o arquivo se não existir
          if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({ lastId: 0 }, null, 2));
          }

          // lê o valor atual
          const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

          // incrementa
          data.lastId += 1;

          // salva de volta no arquivo
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

          // retorna o novo id
          return data.lastId;
        },

        resetCounter() {
          const filePath = path.resolve("cypress/fixtures/counter.json");
          fs.writeFileSync(filePath, JSON.stringify({ lastId: 0 }, null, 2));
          return null;
        }
      });

      return config;
    },
  },
});