const fs = require('fs');

const deleteFile = async (filename) => {
  try {
    await fs.promises.stat(filename);
  } catch (error) {
    return;
  }
  await fs.promises.unlink(filename);
};

module.exports = {
  deleteFile,
};
