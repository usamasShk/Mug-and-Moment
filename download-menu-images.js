const fs = require('fs');
const path = require('path');
const https = require('https');

// List of image URLs and their destination filenames
const imagesToDownload = [
  // Hot Beverages
  {
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    filename: 'hot-coffee.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1596952992251-24b2307bad66',
    filename: 'espresso.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1534778101976-62847782c213',
    filename: 'cappuccino.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1582202736282-a068fbd0eed2',
    filename: 'latte.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1579888071069-c107a6f79d82',
    filename: 'mocha.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1547825407-2d060104b7f8',
    filename: 'caramel-macchiato.png'
  },
  
  // Cold Beverages
  {
    url: 'https://images.unsplash.com/photo-1529088148546-645efc92db32',
    filename: 'iced-coffee.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
    filename: 'cold-brew.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1620360289812-b1cce8ce19a6',
    filename: 'iced-latte.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d',
    filename: 'frappuccino.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc',
    filename: 'iced-tea.png'
  },
  {
    url: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg',
    filename: 'lemonade.png'
  },
  
  // Snacks & Pastries
  {
    url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
    filename: 'chocolate-cookie.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1623428454614-abaf7c5605f2',
    filename: 'vegan-muffin.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
    filename: 'croissant.png'
  },
  {
    url: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg',
    filename: 'cheese-danish.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1585535790553-095b263d621f',
    filename: 'bagel.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2',
    filename: 'brownie.png'
  },
  
  // Breakfast Items
  {
    url: 'https://images.unsplash.com/photo-1588137378164-543922f9f9e7',
    filename: 'avocado-toast.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1639744091981-2460aeb23f32',
    filename: 'breakfast-sandwich.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1623428453054-24fd0515f3d2',
    filename: 'overnight-oats.png'
  },
  {
    url: 'https://images.unsplash.com/photo-1574179226364-0e640b8c7819',
    filename: 'yogurt-parfait.png'
  }
];

// Create images directory if it doesn't exist
const imagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    const file = fs.createWriteStream(filePath);
    
    // Handle different image sources
    const isUnsplash = url.includes('unsplash');
    const isPexels = url.includes('pexels');
    
    let finalUrl = url;
    if (isUnsplash) {
      finalUrl = `${url}?w=600&h=600&fit=crop&q=80`;
    } else if (isPexels) {
      // Pexels already has parameters in the URL
      finalUrl = url;
    }
    
    https.get(finalUrl, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file if there's an error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting download of menu images...');
  
  for (const image of imagesToDownload) {
    try {
      await downloadImage(image.url, image.filename);
    } catch (error) {
      console.error(`Error downloading ${image.filename}:`, error.message);
    }
  }
  
  console.log('All downloads completed!');
}

downloadAllImages(); 