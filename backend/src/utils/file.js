const fs = require('fs');
const path = require('path');

const deleteFile = async (filePath) => {
  const resolvedPath = path.resolve(__dirname, filePath);
  try {
    await fs.promises.stat(resolvedPath);
  } catch (error) {
    return;
  }
  await fs.promises.unlink(resolvedPath);
};

module.exports = {
  deleteFile,
};
