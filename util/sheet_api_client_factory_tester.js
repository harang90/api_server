
const SheetApiClientFactory = require('./sheet_api_client_factory');

async function main() {
  try {
    await SheetApiClientFactory.create();
  } catch (err) {
    console.error(err);
  }
}

main();