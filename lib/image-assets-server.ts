import { DEFAULT_IMAGE_ASSETS, type ImageAssetStatus } from "@/lib/image-assets";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";

export type SiteImageAssetRow = {
  key: string;
  area: string;
  label: string;
  original_url: string;
  replacement_url: string | null;
  status: ImageAssetStatus;
  sort_order: number;
  updated_at?: string;
};

export type MergedImageAsset = SiteImageAssetRow & {
  effective_url: string;
};

function fallbackRows(): SiteImageAssetRow[] {
  return DEFAULT_IMAGE_ASSETS.map((asset) => ({
    key: asset.key,
    area: asset.area,
    label: asset.label,
    original_url: asset.originalUrl,
    replacement_url: null,
    status: asset.status,
    sort_order: asset.sortOrder,
  }));
}

export async function getAdminImageAssets(): Promise<MergedImageAsset[]> {
  const defaults = fallbackRows();

  if (!hasDatabaseUrl()) {
    return defaults.map((asset) => ({
      ...asset,
      effective_url: asset.replacement_url || asset.original_url,
    }));
  }

  try {
    const { rows } = await query<SiteImageAssetRow>(
      "select * from site_image_assets order by sort_order asc, key asc",
    );
    const byKey = new Map(rows.map((row) => [row.key, row]));

    return defaults.map((asset) => {
      const override = byKey.get(asset.key);
      const merged = override
        ? {
            ...asset,
            ...override,
            area: override.area || asset.area,
            label: override.label || asset.label,
            original_url: override.original_url || asset.original_url,
          }
        : asset;

      return {
        ...merged,
        effective_url: merged.replacement_url || merged.original_url,
      };
    });
  } catch {
    return defaults.map((asset) => ({
      ...asset,
      effective_url: asset.replacement_url || asset.original_url,
    }));
  }
}

export async function getPublicImageAssetMap(): Promise<Record<string, string>> {
  const assets = await getAdminImageAssets();
  return Object.fromEntries(
    assets
      .filter((asset) => asset.replacement_url)
      .map((asset) => [asset.key, asset.replacement_url as string]),
  );
}
