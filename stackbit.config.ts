import { defineStackbitConfig, DocumentStringLikeFieldNonLocalized, SiteMapEntry } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';
import { allModels } from 'sources/local/models';

const gitContentSource = new GitContentSource({
    rootPath: __dirname,
    contentDirs: ['content'],
    models: Object.values(allModels),
    assetsConfig: {
        referenceType: 'static',
        staticDir: 'public',
        uploadDir: 'images',
        publicPath: '/'
    }
});

// @ts-expect-error - Stackbit type doesn't yet include 'pageLayoutComponentPath'
export const config = defineStackbitConfig({
    stackbitVersion: '~0.7.0',
    ssgName: 'nextjs',
    nodeVersion: '18',
    styleObjectModelName: 'ThemeStyle',
    contentSources: [gitContentSource],
    presetSource: {
        type: 'files',
        presetDirs: ['sources/local/presets']
    },
    pageLayoutKey: 'layout',
    // ✅ Required for Stackbit Editor to load layout
    pageLayoutComponentPath: ({ document }) => {
        const layout = document.fields.layout?.value;
        if (!layout) return undefined;
        return `src/components/layouts/${layout}/index.tsx`;
    },
    siteMap: ({ documents, models }): SiteMapEntry[] => {
        const pageModels = models.filter((model) => model.type === 'page').map((model) => model.name);
        return documents
            .filter((document) => pageModels.includes(document.modelName))
            .map((document) => {
                let slug = (document.fields.slug as DocumentStringLikeFieldNonLocalized)?.value;
                if (!slug) return null;
                slug = slug.replace(/^\/+/, '');
                switch (document.modelName) {
                    case 'PostFeedLayout':
                        return {
                            urlPath: '/blog',
                            document
                        };
                    case 'PostLayout':
                        return {
                            urlPath: `/blog/${slug}`,
                            document
                        };
                    default:
                        return {
                            urlPath: `/${slug}`,
                            document
                        };
                }
            })
            .filter(Boolean) as SiteMapEntry[];
    }
});

export default config;
