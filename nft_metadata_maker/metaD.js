const fs = require('fs');
const path = require('path');

// Replace with your actual IPFS base URL (e.g., "https://ipfs.io/ipfs/<CID>")
const baseIpfsUrl = 'https://ipfs.io/ipfs/<CID>';

//External url
const externalUr = "https://example.com";

//Json file name
const _metadataName = "face";
//Metadata description
const _descriptions = "A few face images";

function generateMetadata(baseIpfsUrl) {
  const traitsFile = path.join(__dirname, 'output/traits.json');

  if (!fs.existsSync(traitsFile)) {
    console.error('Traits JSON file not found. Run imageGenerator.js first.');
    return;
  }

  const traitsData = JSON.parse(fs.readFileSync(traitsFile));
  const metadataDir = path.join(__dirname, 'output/metadata');
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir, { recursive: true });
  }

  traitsData.forEach(({ id, attributes }) => {
    const metadata = {
      name: `${_metadataName}${id}`,
      description: `${_descriptions} - ${id}`,
      image: `${baseIpfsUrl}/${_metadataName}${id}.png`,
      external_url: `${externalUr}/icbm${id}.png`,
      attributes,
      properties: {
        files: [{ uri: `${baseIpfsUrl}/${_metadataName}${id}.png`, type: 'image/png' }],
        category: 'image',
      },
    };

    fs.writeFileSync(
      // Input metadataName here
      path.join(metadataDir, `${_metadataName}${id}.json`),
      JSON.stringify(metadata, null, 2),
    );
    console.log(`Generated metadata #${id}`);
  });
}


generateMetadata(baseIpfsUrl);