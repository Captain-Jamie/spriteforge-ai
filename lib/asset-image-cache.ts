import type { AssetRecord } from "./asset-schema";

const DB_NAME = "spriteforge.asset-cache.v1";
const STORE_NAME = "images";
const DB_VERSION = 1;

type CachedImageRecord = {
  assetId: string;
  dataUrl: string;
  sourceImageUrl: string;
  updatedAt: string;
};

export async function hydrateAssetsWithCachedImages(assets: AssetRecord[]) {
  const hydratedAssets = await Promise.all(
    assets.map(async (asset) => {
      const cachedImage = await getCachedAssetImage(asset.id);

      if (!cachedImage) {
        return asset;
      }

      return {
        ...asset,
        imageUrl: cachedImage.dataUrl,
        sourceImageUrl: cachedImage.sourceImageUrl
      };
    })
  );

  return hydratedAssets;
}

export async function cacheAssetImages(assets: AssetRecord[]) {
  const cachedAssets = await Promise.all(
    assets.map(async (asset) => {
      try {
        const sourceImageUrl = asset.sourceImageUrl ?? asset.imageUrl;
        const cachedImage = await getCachedAssetImage(asset.id);

        if (cachedImage?.sourceImageUrl === sourceImageUrl) {
          return {
            ...asset,
            imageUrl: cachedImage.dataUrl,
            sourceImageUrl
          };
        }

        const dataUrl = await imageUrlToDataUrl(sourceImageUrl);
        await putCachedAssetImage({
          assetId: asset.id,
          dataUrl,
          sourceImageUrl,
          updatedAt: new Date().toISOString()
        });

        return {
          ...asset,
          imageUrl: dataUrl,
          sourceImageUrl
        };
      } catch {
        return asset;
      }
    })
  );

  return cachedAssets;
}

export async function deleteCachedAssetImages(assetIds: string[]) {
  if (typeof window === "undefined" || !window.indexedDB) {
    return;
  }

  const db = await openCacheDb();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  assetIds.forEach((assetId) => store.delete(assetId));
  await waitForTransaction(transaction);
  db.close();
}

export async function clearCachedAssetImages() {
  if (typeof window === "undefined" || !window.indexedDB) {
    return;
  }

  const db = await openCacheDb();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  transaction.objectStore(STORE_NAME).clear();
  await waitForTransaction(transaction);
  db.close();
}

async function imageUrlToDataUrl(imageUrl: string) {
  if (imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  const response = await fetch("/api/cache-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ imageUrl })
  });

  if (!response.ok) {
    throw new Error("Failed to cache asset image");
  }

  const payload = (await response.json()) as { dataUrl?: unknown };

  if (typeof payload.dataUrl !== "string" || !payload.dataUrl.startsWith("data:")) {
    throw new Error("Invalid cached asset image response");
  }

  return payload.dataUrl;
}

async function getCachedAssetImage(assetId: string) {
  if (typeof window === "undefined" || !window.indexedDB) {
    return null;
  }

  const db = await openCacheDb();
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(assetId);
  const result = await waitForRequest<CachedImageRecord | undefined>(request);
  db.close();

  return result ?? null;
}

async function putCachedAssetImage(record: CachedImageRecord) {
  if (typeof window === "undefined" || !window.indexedDB) {
    return;
  }

  const db = await openCacheDb();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  transaction.objectStore(STORE_NAME).put(record);
  await waitForTransaction(transaction);
  db.close();
}

function openCacheDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "assetId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function waitForRequest<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function waitForTransaction(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}
