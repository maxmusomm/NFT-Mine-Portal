const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Configuration: Image dimensions
const WIDTH = 100;
const HEIGHT = 100;

//Folders for each layer and rarity percentage of the layer
const rarityConfig = {
  'bg': { 
  '1.png': 25,
  '2.png': 25,
  '3.png': 25
  },
  'face': {
    '1.png': 60, 
    '2.png': 40,
    '3.png': 40
  },
  'hat': { 
    '1.png': 50, 
    '2.png': 40,
    '3.png': 30,
  },
};

//Number of images to be generated if left 0 default is 10
const numOfImages = 20;

function weightedRandom(weights) {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (const [item, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) return item;
  }
  return Object.keys(weights)[0];
}

async function generateImages(numFiles = 10) {
  const inputDir = path.join(__dirname, 'input');
  const outputDir = path.join(__dirname, 'output/images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const traitsUsed = [];

  for (let i = 1; i <= numFiles; i++) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const attributes = [];
    const layers = fs
      .readdirSync(inputDir)
      .filter(dir => fs.statSync(path.join(inputDir, dir)).isDirectory())
      .sort();

    for (const layer of layers) {
      const layerPath = path.join(inputDir, layer);
      const availableFiles = fs
        .readdirSync(layerPath)
        .filter(file => file.endsWith('.png'));

      if (availableFiles.length > 0) {
        const weights = rarityConfig[layer] ||
          Object.fromEntries(availableFiles.map(f => [f, 100 / availableFiles.length]));
        const selectedFile = weightedRandom(weights);

        const imagePath = path.join(layerPath, selectedFile);
        const image = await loadImage(imagePath);
        ctx.drawImage(image, 0, 0, WIDTH, HEIGHT);

        attributes.push({
          trait_type: layer.split('_')[1],
          value: path.parse(selectedFile).name,
        });
      }
    }

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(outputDir, `icbm${i}.png`), buffer);
    traitsUsed.push({ id: i, attributes });
    console.log(`Generated image #${i}`);
  }

  // Save traits for metadata generation
  fs.writeFileSync(
    path.join(__dirname, 'output/traits.json'),
    JSON.stringify(traitsUsed, null, 2),
  );
}

generateImages(numOfImages).catch(console.error);
