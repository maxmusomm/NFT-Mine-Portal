const fs = require('fs');
const path = require('path');

// Function to recursively delete directory contents
function cleanDirectory(directory) {
    if (fs.existsSync(directory)) {
        fs.readdirSync(directory).forEach((file) => {
            const currentPath = path.join(directory, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                // Recursively clean subdirectories
                cleanDirectory(currentPath);
                // Remove the now-empty directory
                fs.rmdirSync(currentPath);
            } else {
                // Delete file
                fs.unlinkSync(currentPath);
            }
        });
        console.log(`Cleaned directory: ${directory}`);
    } else {
        console.log(`Directory doesn't exist: ${directory}`);
    }
}

// Clean the output directory and its subdirectories
const outputDir = path.join(__dirname, 'output');
try {
    cleanDirectory(outputDir);
    console.log('Output folder cleanup completed successfully!');
} catch (error) {
    console.error('Error during cleanup:', error);
}