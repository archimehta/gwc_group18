// Helper to get random earth/sun/star/cloud character images
const EARTH_ASSETS = [
  '/earth/earth-01.png',
  '/earth/earth-02.png',
  '/earth/earth-03.png',
  '/earth/earth-04.png',
  '/earth/earth-05.png',
  '/earth/earth-06.png',
  '/earth/earth-07.png',
  '/earth/earth-08.png',
  '/earth/earth-09.png',
  '/earth/earth-10.png',
  '/earth/earth-11.png',
  '/earth/earth-12.png',
  '/earth/sun-01.png',
  '/earth/sun-02.png',
  '/earth/sun-03.png',
  '/earth/sun-04.png',
  '/earth/star-01.png',
  '/earth/cloud-01.png',
]

export function getRandomEarthAsset(): string {
  const randomIndex = Math.floor(Math.random() * EARTH_ASSETS.length)
  return EARTH_ASSETS[randomIndex]
}

export function getAllEarthAssets(): string[] {
  return EARTH_ASSETS
}
